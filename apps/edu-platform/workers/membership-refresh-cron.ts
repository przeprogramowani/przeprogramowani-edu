interface MembershipRefreshCronEnv {
  SITE_URL: string;
  EXTERNAL_MEMBERSHIP_REFRESH_SECRET: string;
}

async function triggerMembershipRefresh(env: MembershipRefreshCronEnv): Promise<void> {
  const endpoint = new URL('/api/external/membership-refresh', env.SITE_URL).toString();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.EXTERNAL_MEMBERSHIP_REFRESH_SECRET}`,
    },
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(
      `Membership refresh failed (${response.status} ${response.statusText}): ${responseBody}`
    );
  }
}

export default {
  async scheduled(_event: unknown, env: MembershipRefreshCronEnv): Promise<void> {
    try {
      await triggerMembershipRefresh(env);
      console.info('[membership-refresh-cron] refresh_triggered');
    } catch (error) {
      console.error('[membership-refresh-cron] refresh_failed', error);
    }
  },
};
