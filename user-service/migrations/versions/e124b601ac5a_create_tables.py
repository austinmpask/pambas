"""create tables

Revision ID: e124b601ac5a
Revises: 
Create Date: 2024-05-07 01:16:06.493951

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e124b601ac5a"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "domains",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("domain_name", sa.String(length=60), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("domain_name"),
    )
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_name", sa.String(length=20), nullable=False),
        sa.Column("email", sa.String(length=100), nullable=False),
        sa.Column("password_hash", sa.String(length=60), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("domain_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["domain_id"],
            ["domains.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("user_name"),
    )


def downgrade():
    op.drop_table("users")
    op.drop_table("domains")
