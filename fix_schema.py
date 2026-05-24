import os

filepath = "database_schema.sql"
with open(filepath, "r") as f:
    content = f.read()

# Add phone to users
content = content.replace(
    "  preferred_language VARCHAR(5) DEFAULT 'pt-BR',",
    "  preferred_language VARCHAR(5) DEFAULT 'pt-BR',\n  phone TEXT,"
)

# Add trial_ends_at to spaces
content = content.replace(
    "  stripe_subscription_id TEXT, -- Ligação com o faturamento",
    "  stripe_subscription_id TEXT, -- Ligação com o faturamento\n  trial_ends_at TIMESTAMPTZ,"
)

with open(filepath, "w") as f:
    f.write(content)

