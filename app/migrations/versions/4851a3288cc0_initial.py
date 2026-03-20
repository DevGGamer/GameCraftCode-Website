"""initial

Revision ID: 4851a3288cc0
Revises:
Create Date: 2026-03-19

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '4851a3288cc0'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('login', sa.String(), nullable=False, unique=True),
        sa.Column('password', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('surname', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('role', sa.String(), server_default=sa.text("'student'"), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('birth_date', sa.Date(), nullable=True),
        sa.Column('level', sa.Integer(), server_default=sa.text('1'), nullable=True),
        sa.Column('coins', sa.Integer(), server_default=sa.text('0'), nullable=True),
        sa.Column('balance', sa.Integer(), server_default=sa.text('0'), nullable=True),
        sa.Column('created_at', sa.Date(), server_default=sa.func.current_date(), nullable=True),
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'])

    op.create_table(
        'user_courses',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('student_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('teacher_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('course_id', sa.String(), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('completed_lessons', postgresql.JSONB(), nullable=True),
    )
    op.create_index(op.f('ix_user_courses_id'), 'user_courses', ['id'])

    op.create_table(
        'user_achievements',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('achievement_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.current_date(), nullable=True),
        sa.UniqueConstraint('user_id', 'achievement_id', name='uq_user_achievement'),
    )
    op.create_index(op.f('ix_user_achievements_id'), 'user_achievements', ['id'])

    op.create_table(
        'user_activity',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('activity_date', sa.Date(), nullable=False),
        sa.UniqueConstraint('user_id', 'activity_date', name='uq_user_activity_day'),
    )
    op.create_index(op.f('ix_user_activity_id'), 'user_activity', ['id'])

    op.create_table(
        'parent_student_relationships',
        sa.Column('parent_id', sa.Integer(), sa.ForeignKey('users.id'), primary_key=True),
        sa.Column('student_id', sa.Integer(), sa.ForeignKey('users.id'), primary_key=True),
    )

    op.create_table(
        'teacher_info',
        sa.Column('teacher_id', sa.Integer(), sa.ForeignKey('users.id'), primary_key=True),
        sa.Column('course_id', sa.String(), primary_key=True),
    )


def downgrade() -> None:
    op.drop_table('teacher_info')
    op.drop_table('parent_student_relationships')
    op.drop_index(op.f('ix_user_activity_id'), table_name='user_activity')
    op.drop_table('user_activity')
    op.drop_index(op.f('ix_user_achievements_id'), table_name='user_achievements')
    op.drop_table('user_achievements')
    op.drop_index(op.f('ix_user_courses_id'), table_name='user_courses')
    op.drop_table('user_courses')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
