import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';
import { useAppSelector, useAppDispatch } from '@/hooks/store';
import { updateUser } from '@/store/authSlice';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/store/api/authApi';
import { Button, Input, Card } from '@/components/ui';

export default function SettingsPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? '',
    phoneNumber: user?.phoneNumber?.replace('+', '') ?? '',
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors({});
    setProfileSuccess('');

    const errors: Record<string, string> = {};
    if (profileForm.name.length < 2) errors.name = t('settings.nameMin');
    if (profileForm.phoneNumber.length !== 12) errors.phoneNumber = t('settings.phoneInvalid');
    if (Object.keys(errors).length > 0) { setProfileErrors(errors); return; }

    try {
      const body: { name?: string; phoneNumber?: string } = {};
      if (profileForm.name !== user?.name) body.name = profileForm.name;
      if (`+${profileForm.phoneNumber}` !== user?.phoneNumber) body.phoneNumber = `+${profileForm.phoneNumber}`;

      if (Object.keys(body).length === 0) {
        setProfileSuccess(t('settings.profileUpdated'));
        return;
      }

      const res = await updateProfile(body).unwrap();
      dispatch(updateUser({ name: res.data.name, phoneNumber: res.data.phoneNumber }));
      setProfileSuccess(t('settings.profileUpdated'));
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setProfileErrors({ name: apiErr.data?.message || t('common.error') });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});
    setPasswordSuccess('');

    const errors: Record<string, string> = {};
    if (passwordForm.currentPassword.length < 1) errors.currentPassword = t('settings.required');
    if (passwordForm.newPassword.length < 8) errors.newPassword = t('settings.passwordMin');
    if (!/[A-Z]/.test(passwordForm.newPassword)) errors.newPassword = t('settings.passwordUppercase');
    if (!/[0-9]/.test(passwordForm.newPassword)) errors.newPassword = t('settings.passwordNumber');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = t('settings.passwordMismatch');
    if (Object.keys(errors).length > 0) { setPasswordErrors(errors); return; }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      setPasswordSuccess(t('settings.passwordChanged'));
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setPasswordErrors({ currentPassword: apiErr.data?.message || t('common.error') });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">{t('settings.title')}</h1>

      {/* Profile Section */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('settings.profile')}</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <Input
            label={t('common.name')}
            value={profileForm.name}
            onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
            error={profileErrors.name}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">{t('auth.phoneNumber')}</label>
            <IMaskInput
              mask="+{998} (00) 000-00-00"
              value={profileForm.phoneNumber}
              unmask={true}
              onAccept={(value: string) => setProfileForm((f) => ({ ...f, phoneNumber: value }))}
              placeholder="+998 (XX) XXX-XX-XX"
              className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${profileErrors.phoneNumber ? 'border-red-500' : 'border-slate-300'}`}
            />
            {profileErrors.phoneNumber && <p className="text-xs text-red-600">{profileErrors.phoneNumber}</p>}
          </div>
          {profileSuccess && <p className="text-sm text-green-600">{profileSuccess}</p>}
          <div className="flex justify-end">
            <Button type="submit" loading={updatingProfile}>{t('common.save')}</Button>
          </div>
        </form>
      </Card>

      {/* Password Section */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('settings.changePassword')}</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label={t('settings.currentPassword')}
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
            error={passwordErrors.currentPassword}
          />
          <Input
            label={t('settings.newPassword')}
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
            error={passwordErrors.newPassword}
          />
          <Input
            label={t('settings.confirmPassword')}
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            error={passwordErrors.confirmPassword}
          />
          {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
          <div className="flex justify-end">
            <Button type="submit" loading={changingPassword}>{t('settings.changePassword')}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
