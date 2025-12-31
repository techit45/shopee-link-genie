import { useState } from 'react';
import { User, Key, Bell, Share2, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const [showSecrets, setShowSecrets] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@shopeeaff.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shopee',
  });

  const [apiSettings, setApiSettings] = useState({
    involveAsiaClientId: '',
    involveAsiaClientSecret: '',
    connectionStatus: 'disconnected' as 'connected' | 'disconnected' | 'error',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    conversionAlerts: true,
    campaignUpdates: true,
    weeklyReports: true,
  });

  const [socialConnections, setSocialConnections] = useState({
    facebook: { connected: false, token: '' },
    line: { connected: true, token: 'LINE_TOKEN_****' },
    telegram: { connected: false, token: '' },
  });

  const handleSaveProfile = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile settings have been saved successfully.',
    });
  };

  const handleTestConnection = () => {
    toast({
      title: 'Testing Connection',
      description: 'Verifying your Involve Asia credentials...',
    });
    setTimeout(() => {
      setApiSettings((prev) => ({ ...prev, connectionStatus: 'connected' }));
      toast({
        title: 'Connection Successful',
        description: 'Successfully connected to Involve Asia API.',
      });
    }, 1500);
  };

  const handleToggleSocialConnection = (platform: 'facebook' | 'line' | 'telegram') => {
    setSocialConnections((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        connected: !prev[platform].connected,
      },
    }));
    toast({
      title: socialConnections[platform].connected ? 'Disconnected' : 'Connected',
      description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} ${
        socialConnections[platform].connected ? 'disconnected' : 'connected'
      } successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="h-4 w-4" />
            Social
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, GIF or PNG. Max 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div />
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Integrations */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
              <CardDescription>
                Connect external services to enhance your affiliate operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Involve Asia */}
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Involve Asia</h4>
                      <p className="text-sm text-muted-foreground">
                        Affiliate network integration
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      apiSettings.connectionStatus === 'connected'
                        ? 'default'
                        : apiSettings.connectionStatus === 'error'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className="gap-1"
                  >
                    {apiSettings.connectionStatus === 'connected' && (
                      <Check className="h-3 w-3" />
                    )}
                    {apiSettings.connectionStatus === 'error' && (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {apiSettings.connectionStatus.charAt(0).toUpperCase() +
                      apiSettings.connectionStatus.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-id">Client ID</Label>
                    <Input
                      id="client-id"
                      placeholder="Enter your Involve Asia Client ID"
                      value={apiSettings.involveAsiaClientId}
                      onChange={(e) =>
                        setApiSettings({ ...apiSettings, involveAsiaClientId: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-secret">Client Secret</Label>
                    <div className="relative">
                      <Input
                        id="client-secret"
                        type={showSecrets ? 'text' : 'password'}
                        placeholder="Enter your Involve Asia Client Secret"
                        value={apiSettings.involveAsiaClientSecret}
                        onChange={(e) =>
                          setApiSettings({
                            ...apiSettings,
                            involveAsiaClientSecret: e.target.value,
                          })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowSecrets(!showSecrets)}
                      >
                        {showSecrets ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleTestConnection} variant="outline">
                    Test Connection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you want to receive updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates for important events
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, pushNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Conversion Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when a conversion happens
                    </p>
                  </div>
                  <Switch
                    checked={notifications.conversionAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, conversionAlerts: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Campaign Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications about campaign status changes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.campaignUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, campaignUpdates: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly performance summary emails
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyReports: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Connections */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Connections</CardTitle>
              <CardDescription>
                Connect your social media accounts for content posting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Facebook */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1877F2]/10">
                    <svg className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Facebook Page</h4>
                    <p className="text-sm text-muted-foreground">
                      {socialConnections.facebook.connected
                        ? 'Connected to your page'
                        : 'Connect to post content'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={socialConnections.facebook.connected ? 'destructive' : 'default'}
                  onClick={() => handleToggleSocialConnection('facebook')}
                >
                  {socialConnections.facebook.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>

              {/* LINE */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00B900]/10">
                    <svg className="h-5 w-5 text-[#00B900]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">LINE Official Account</h4>
                    <p className="text-sm text-muted-foreground">
                      {socialConnections.line.connected
                        ? 'Connected to your OA'
                        : 'Connect to broadcast messages'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={socialConnections.line.connected ? 'destructive' : 'default'}
                  onClick={() => handleToggleSocialConnection('line')}
                >
                  {socialConnections.line.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>

              {/* Telegram */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0088CC]/10">
                    <svg className="h-5 w-5 text-[#0088CC]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Telegram Bot</h4>
                    <p className="text-sm text-muted-foreground">
                      {socialConnections.telegram.connected
                        ? 'Bot is active'
                        : 'Connect to send messages'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={socialConnections.telegram.connected ? 'destructive' : 'default'}
                  onClick={() => handleToggleSocialConnection('telegram')}
                >
                  {socialConnections.telegram.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
