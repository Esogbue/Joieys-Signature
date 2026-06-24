from django.contrib import admin
from .models import Category, Product, ProductSize

class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 5

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductSizeInline]
    exclude = ('size', 'stock')

admin.site.register(Category)
