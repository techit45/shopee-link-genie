import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, Loader2, QrCode, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types';
import { mockProducts, mockCampaigns } from '@/data/mockData';
import { ProductSelector } from './ProductSelector';
import { linkGeneratorService, availableProperties, GenerateLinkResponse } from '@/services/linkGenerator';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LinkGeneratorDialogProps {
  open: boolean;
  onClose: () => void;
  preselectedProduct?: Product;
  onLinkGenerated?: (link: GenerateLinkResponse) => void;
}

type Step = 'select' | 'configure' | 'result';

export function LinkGeneratorDialog({
  open,
  onClose,
  preselectedProduct,
  onLinkGenerated,
}: LinkGeneratorDialogProps) {
  const [step, setStep] = useState<Step>(preselectedProduct ? 'configure' : 'select');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(preselectedProduct || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<GenerateLinkResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Configuration form state
  const [propertyId, setPropertyId] = useState('');
  const [campaignId, setCampaignId] = useState<string>('');
  const [subId, setSubId] = useState('');
  const [customAlias, setCustomAlias] = useState('');

  const handleClose = () => {
    setStep('select');
    setSelectedProduct(null);
    setGeneratedLink(null);
    setPropertyId('');
    setCampaignId('');
    setSubId('');
    setCustomAlias('');
    setCopied(false);
    onClose();
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleNextStep = () => {
    if (step === 'select' && selectedProduct) {
      setStep('configure');
    }
  };

  const handlePrevStep = () => {
    if (step === 'configure') {
      setStep('select');
    } else if (step === 'result') {
      setStep('configure');
      setGeneratedLink(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedProduct || !propertyId) return;

    setIsGenerating(true);
    try {
      const property = availableProperties.find((p) => p.id === propertyId);
      const campaign = campaignId ? mockCampaigns.find((c) => c.id.toString() === campaignId) : null;

      const response = await linkGeneratorService.generateLink({
        productId: selectedProduct.id,
        propertyId,
        propertyName: property?.name || 'Unknown',
        campaignId: campaign?.id,
        campaignName: campaign?.name,
        subId: subId || undefined,
        customAlias: customAlias || undefined,
      });

      setGeneratedLink(response);
      setStep('result');
      onLinkGenerated?.(response);

      toast({
        title: 'Link Generated!',
        description: 'Your affiliate link has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink.shortLink);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Link copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateAnother = () => {
    setStep('select');
    setSelectedProduct(null);
    setGeneratedLink(null);
    setPropertyId('');
    setCampaignId('');
    setSubId('');
    setCustomAlias('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' && 'Generate Affiliate Link'}
            {step === 'configure' && 'Configure Link Settings'}
            {step === 'result' && 'Link Generated Successfully!'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' && 'Select a product to generate an affiliate link'}
            {step === 'configure' && 'Set up tracking and channel configuration'}
            {step === 'result' && 'Your affiliate link is ready to share'}
          </DialogDescription>
        </DialogHeader>

        {/* Step Progress */}
        <div className="flex items-center justify-center gap-2 py-4">
          {['select', 'configure', 'result'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : ['result', 'configure'].includes(step) && i < ['select', 'configure', 'result'].indexOf(step)
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {['result', 'configure'].includes(step) && i < ['select', 'configure', 'result'].indexOf(step) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 w-12',
                    ['result', 'configure'].includes(step) && i < ['select', 'configure', 'result'].indexOf(step)
                      ? 'bg-success'
                      : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Product */}
        {step === 'select' && (
          <>
            <ProductSelector
              products={mockProducts}
              selectedProduct={selectedProduct}
              onSelect={handleSelectProduct}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleNextStep} disabled={!selectedProduct}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {/* Step 2: Configure */}
        {step === 'configure' && selectedProduct && (
          <>
            {/* Selected Product Preview */}
            <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
              <img
                src={selectedProduct.image_urls[0]}
                alt={selectedProduct.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{selectedProduct.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedProduct.shop_name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-semibold text-primary">{formatPrice(selectedProduct.price)}</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedProduct.commission_rate}% commission
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handlePrevStep}>
                Change
              </Button>
            </div>

            <Separator />

            {/* Configuration Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property">Channel / Property *</Label>
                <Select value={propertyId} onValueChange={setPropertyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProperties.map((prop) => (
                      <SelectItem key={prop.id} value={prop.id}>
                        {prop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign (Optional)</Label>
                <Select value={campaignId} onValueChange={setCampaignId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No campaign</SelectItem>
                    {mockCampaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id.toString()}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subId">Sub ID (Optional)</Label>
                  <Input
                    id="subId"
                    placeholder="e.g., promo_summer"
                    value={subId}
                    onChange={(e) => setSubId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">For additional tracking</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alias">Custom Alias (Optional)</Label>
                  <Input
                    id="alias"
                    placeholder="e.g., summer-deal"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Custom short link ending</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleGenerate} disabled={!propertyId || isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Link'
                )}
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Result */}
        {step === 'result' && generatedLink && (
          <>
            <div className="space-y-6">
              {/* Success Animation */}
              <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-10 w-10 text-success" />
                </div>
              </div>

              {/* Generated Link */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <Label className="text-muted-foreground">Your Affiliate Link</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    value={generatedLink.shortLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button onClick={handleCopyLink} variant="outline">
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-3">
                <Label className="text-muted-foreground">QR Code</Label>
                <div className="rounded-lg border bg-background p-4">
                  <img
                    src={generatedLink.qrCode}
                    alt="QR Code"
                    className="h-40 w-40"
                  />
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={generatedLink.qrCode} download="qr-code.png">
                    <QrCode className="mr-2 h-4 w-4" />
                    Download QR Code
                  </a>
                </Button>
              </div>

              {/* Link Details */}
              <div className="grid gap-2 rounded-lg border p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-medium">{generatedLink.product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Channel</span>
                  <span className="font-medium">{generatedLink.propertyName}</span>
                </div>
                {generatedLink.campaignName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Campaign</span>
                    <span className="font-medium">{generatedLink.campaignName}</span>
                  </div>
                )}
                {generatedLink.subId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sub ID</span>
                    <span className="font-medium">{generatedLink.subId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={handleGenerateAnother}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Another
              </Button>
              <Button onClick={handleClose}>Done</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
