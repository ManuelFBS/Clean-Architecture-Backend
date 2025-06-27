import bcrypt from 'bcrypt';

bcrypt
    .compare(
        'Sa12345678*',
        '$2b$10$NG0oPkUZfRD3HrsYhdt5Zup9EbWWMSrsnBYI9CN8Tje1zBUIdr0j6',
    )
    .then(console.log);
