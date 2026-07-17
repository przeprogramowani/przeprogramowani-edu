import MailerLite from '@mailerlite/mailerlite-nodejs';

function formatDateForMailerLite(date: Date): string {
  return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
}

type MailerLiteStatus = 'active' | 'unconfirmed' | 'unsubscribed';

export async function subscribeToNewsletter(
  email: string,
  apiKey: string,
  groupId: string,
  status: MailerLiteStatus = 'unconfirmed',
  optinIp?: string
): Promise<void> {
  const mailerlite = new MailerLite({ api_key: apiKey });
  const res = await mailerlite.subscribers.createOrUpdate({
    email,
    status,
    groups: [groupId],
    opted_in_at: formatDateForMailerLite(new Date()),
    optin_ip: optinIp,
  });
  console.info('[newsletter] Subscribed', { email, groupId, status: res.status });
}

export async function assignSubscriberToGroup(
  email: string,
  apiKey: string,
  groupId: string
): Promise<void> {
  const mailerlite = new MailerLite({ api_key: apiKey });
  const res = await mailerlite.groups.assignSubscriber(email, groupId);
  console.info('[newsletter] Group assigned', {
    email: email.slice(0, 3) + '...',
    groupId,
    status: res.status,
  });
}
