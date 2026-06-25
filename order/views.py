import requests
from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status, authentication, permissions
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer

@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def checkout(request):
    serializer = OrderSerializer(data=request.data)

    if serializer.is_valid():
        paid_amount = sum(
            item.get('quantity') * item.get('product').price
            for item in serializer.validated_data['items']
        )

        try:
            paystack_token = serializer.validated_data['paystack_token']
            headers = {
                "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
                "Content-Type": "application/json"
            }
            response = requests.get(
                f"https://api.paystack.co/transaction/verify/{paystack_token}",
                headers=headers
            )
            response_data = response.json()

            if response_data['status'] and response_data['data']['status'] == 'success':
                order = serializer.save(user=request.user, paid_amount=paid_amount)

                # Send confirmation email to customer
                try:
                    send_mail(
                        subject=f"Order Confirmation — Joiey's Signature (Order #{order.id})",
                        message=f"""
Hi {order.first_name},

Thank you for shopping with Joiey's Signature! 🎉

Your order #{order.id} has been received and is being processed.

Order Details:
- Total Paid: ₦{paid_amount:,.2f}
- Delivery Address: {order.address}, {order.place}

You can track your order on our website under "My Orders".

Thank you for your patronage!

Joiey's Signature Team
                        """,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[order.email],
                        fail_silently=True,
                    )
                except Exception:
                    pass

                # Send notification email to store owner
                try:
                    items_text = '\n'.join([
                        f"- {item.get('product').name} | Size: {item.get('size') or 'N/A'} | Qty: {item.get('quantity')} | ₦{item.get('price'):,.2f}"
                        for item in serializer.validated_data['items']
                    ])
                    send_mail(
                        subject=f"🛍️ New Order #{order.id} — ₦{paid_amount:,.2f}",
                        message=f"""
New order received on Joiey's Signature!

ORDER DETAILS:
Order ID: #{order.id}
Total Paid: ₦{paid_amount:,.2f}

CUSTOMER DETAILS:
Name: {order.first_name} {order.last_name}
Email: {order.email}
Phone: {order.phone}

DELIVERY ADDRESS:
{order.address}
{order.place}

ITEMS ORDERED:
{items_text}

Login to admin to update order status:
https://joieyssignature.pythonanywhere.com/admin/order/order/{order.id}/change/
                        """,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[settings.STORE_OWNER_EMAIL],
                        fail_silently=True,
                    )
                except Exception:
                    pass

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {'error': 'Payment verification failed'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(user=request.user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
