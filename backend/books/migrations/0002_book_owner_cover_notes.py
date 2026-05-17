from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        # Add owner FK (nullable first so existing rows don't break, then make required)
        migrations.AddField(
            model_name='book',
            name='owner',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='books',
                to='users.userprofile',
            ),
        ),
        migrations.AddField(
            model_name='book',
            name='cover_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='book',
            name='notes',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='book',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterModelOptions(
            name='book',
            options={'ordering': ['-created_at']},
        ),
    ]
