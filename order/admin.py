from django.contrib import admin
from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ('product', 'quantity', 'price', 'size')
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ('id', 'first_name', 'last_name', 'phone', 'email', 'place', 'paid_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'phone')
    readonly_fields = ('created_at', 'paid_amount', 'paystack_token')
    ordering = ('-created_at',)
    list_per_page = 20

    # Allow sister to update order status
    fields = (
        'status',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'zipcode',
        'place',
        'paid_amount',
        'paystack_token',
        'created_at',
    )
