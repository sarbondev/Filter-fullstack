import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Trash2, Star } from 'lucide-react';
import { useGetReviewsQuery, useApproveReviewMutation, useDeleteReviewMutation } from '@/store/api/reviewApi';
import { Button, Card, Table, Badge, ConfirmDialog } from '@/components/ui';
import type { Review } from '@/lib/types';
import { useLocale } from '@/hooks/useLocale';

export default function ReviewsPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: reviews, isLoading } = useGetReviewsQuery();
  const [approve, { isLoading: approving }] = useApproveReviewMutation();
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getUserName = (r: Review) => {
    const u = r.user;
    return typeof u === 'object' && u !== null ? (u.name ?? '-') : '-';
  };

  const getProductName = (r: Review) => {
    const p = r.product;
    return typeof p === 'object' && p !== null && p.name ? p.name[locale] : '-';
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('reviews.title')}</h1>

      <Card padding={false}>
        <Table<Review>
          loading={isLoading}
          columns={[
            { key: 'user', header: t('reviews.user'), render: (r) => <span className="font-medium">{getUserName(r)}</span> },
            { key: 'product', header: t('reviews.product'), render: (r) => getProductName(r) },
            { key: 'rating', header: t('reviews.rating'), render: (r) => renderStars(r.rating) },
            { key: 'comment', header: t('reviews.comment'), render: (r) => (
              <div className="max-w-xs">
                <p className="truncate text-sm">{r.comment[locale]}</p>
              </div>
            )},
            { key: 'isApproved', header: t('common.status'), render: (r) => (
              <Badge variant={r.isApproved ? 'success' : 'warning'}>
                {r.isApproved ? t('reviews.approved') : t('common.pending')}
              </Badge>
            )},
            { key: 'actions', header: '', className: 'w-24', render: (r) => (
              <div className="flex gap-1">
                {!r.isApproved && (
                  <Button variant="ghost" size="sm" onClick={() => approve(r.id)} disabled={approving}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(r.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            )},
          ]}
          data={reviews ?? []}
          keyExtractor={(r) => r.id}
          emptyMessage={t('reviews.noReviews')}
        />
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await deleteReview(deleteId); setDeleteId(null); } }}
        title={t('reviews.deleteReview')}
        message={t('reviews.deleteConfirm')}
        loading={deleting}
      />
    </div>
  );
}
