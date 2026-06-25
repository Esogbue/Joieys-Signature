from io import BytesIO
import os
from PIL import Image
from django.core.files import File
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField()

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return f'/{self.slug}/'

class Product(models.Model):
    SIZE_CHOICES = [
        ('XS', 'Extra Small'),
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'Extra Large'),
        ('XXL', 'Double Extra Large'),
    ]

    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    slug = models.SlugField()
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='uploads/', blank=True, null=True)
    thumbnail = models.ImageField(upload_to='uploads/', blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)

    # Fashion specific fields
    size = models.CharField(max_length=3, choices=SIZE_CHOICES, default='M')
    color = models.CharField(max_length=100, blank=True, null=True)
    stock = models.IntegerField(default=0)

    class Meta:
        ordering = ('-date_added',)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return f'/{self.category.slug}/{self.slug}/'

    def is_in_stock(self):
        if self.sizes.exists():
            return self.sizes.filter(stock__gt=0).exists()
        return self.stock > 0

    def get_image(self):
        if self.image:
            base_url = os.environ.get('BASE_URL', 'http://127.0.0.1:8000')
            return base_url + self.image.url
        return ''

    def get_thumbnail(self):
        if self.thumbnail:
            base_url = os.environ.get('BASE_URL', 'http://127.0.0.1:8000')
            return base_url + self.thumbnail.url
        else:
            if self.image:
                self.thumbnail = self.make_thumbnail(self.image)
                self.save()
                base_url = os.environ.get('BASE_URL', 'http://127.0.0.1:8000')
                return base_url + self.thumbnail.url
            else:
                return ''

    def make_thumbnail(self, image, size=(300, 200)):
        img = Image.open(image)
        img.convert('RGB')
        img.thumbnail(size)
        thumb_io = BytesIO()
        img.save(thumb_io, 'JPEG', quality=90)
        thumbnail = File(thumb_io, name=image.name)
        return thumbnail
    
class ProductSize(models.Model):
    product = models.ForeignKey(Product, related_name='sizes', on_delete=models.CASCADE)
    size = models.CharField(max_length=10)
    stock = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.product.name} - {self.size}'

    def is_available(self):
        return self.stock > 0
