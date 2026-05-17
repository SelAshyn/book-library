from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('books', '0002_book_owner_cover_notes'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='VocabularyWord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word', models.CharField(max_length=255)),
                ('meaning', models.TextField()),
                ('example', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('book', models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='vocabulary',
                    to='books.book',
                )),
                ('owner', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='vocabulary',
                    to='users.userprofile',
                )),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]
