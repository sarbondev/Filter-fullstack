'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useAppSelector, useAppDispatch } from '@/shared/hooks';
import { updateUserData } from '@/store/authSlice';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/store/api/authApi';
import { Input, PhoneInput, Button } from '@/shared/ui';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function SettingsPageClient({ locale, dict }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

  // Profile form
  const [name, setName] = useState(auth.user?.name ?? '');
  const [phone, setPhone] = useState(auth.user?.phoneNumber ?? '+998');
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordSuccess, setPasswordSuccess] = useState('');

  if (!auth.user) {
    router.push(`/${locale}/auth`);
    return null;
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors({});
    setProfileSuccess('');

    const errors: Record<string, string> = {};
    if (name.length < 2) errors.name = dict.settings.nameMin;
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 12) errors.phone = dict.settings.phoneInvalid;
    if (Object.keys(errors).length > 0) { setProfileErrors(errors); return; }

    try {
      const body: { name?: string; phoneNumber?: string } = {};
      if (name !== auth.user!.name) body.name = name;
      const phoneFormatted = `+${digits}`;
      if (phoneFormatted !== auth.user!.phoneNumber) body.phoneNumber = phoneFormatted;

      if (Object.keys(body).length === 0) {
        setProfileSuccess(dict.settings.profileUpdated);
        return;
      }

      const res = await updateProfile(body).unwrap();
      dispatch(updateUserData({ name: res.data.name, phoneNumber: res.data.phoneNumber }));
      setProfileSuccess(dict.settings.profileUpdated);
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setProfileErrors({ name: apiErr.data?.message || 'Error' });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});
    setPasswordSuccess('');

    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = dict.settings.required;
    if (newPassword.length < 8) errors.newPassword = dict.settings.passwordMin;
    else if (!/[A-Z]/.test(newPassword)) errors.newPassword = dict.settings.passwordUppercase;
    else if (!/[0-9]/.test(newPassword)) errors.newPassword = dict.settings.passwordNumber;
    if (newPassword !== confirmPassword) errors.confirmPassword = dict.settings.passwordMismatch;
    if (Object.keys(errors).length > 0) { setPasswordErrors(errors); return; }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setPasswordSuccess(dict.settings.passwordChanged);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setPasswordErrors({ currentPassword: apiErr.data?.message || 'Error' });
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="rounded-xl bg-primary/10 p-2.5">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{dict.settings.title}</h1>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{dict.settings.profile}</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">{dict.auth.name}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={profileErrors.name}
            />
          </div>
          <PhoneInput
            label={dict.auth.phoneNumber}
            value={phone}
            onValueChange={setPhone}
            error={profileErrors.phone}
          />
          {profileSuccess && <p className="text-sm text-green-600">{profileSuccess}</p>}
          <div className="flex justify-end">
            <Button type="submit" loading={updatingProfile}>{dict.settings.save}</Button>
          </div>
        </form>
      </div>

      {/* Password Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{dict.settings.changePassword}</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">{dict.settings.currentPassword}</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              error={passwordErrors.currentPassword}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">{dict.settings.newPassword}</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={passwordErrors.newPassword}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">{dict.settings.confirmPassword}</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={passwordErrors.confirmPassword}
            />
          </div>
          {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
          <div className="flex justify-end">
            <Button type="submit" loading={changingPassword}>{dict.settings.changePassword}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
