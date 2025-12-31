import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Download,
  Check,
  X,
  Loader2,
  Copy,
  FolderOpen,
  Tag,
  ListFilter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProducts, mockCampaigns } from '@/data/mockData';
import { Product } from '@/types';
import {
  linkGeneratorService,
  availableProperties,
  BatchGenerateResult,
} from '@/services/linkGenerator';
import { toast } from '@/hooks/use-toast';

export default function BulkLinkGenerator() {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [importMethod, setImportMethod] = useState<'manual' | 'campaign' | 'category'>('manual');
  
  // Configuration
  const [propertyId, setPropertyId] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [subIdPattern, setSubIdPattern] = useState('');
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [results, setResults] = useState<BatchGenerateResult[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedCampaignImport, setSelectedCampaignImport] = useState('');

  const categories = useMemo(() => {
    const cats = new Set(mockProducts.map((p) => p.category));
    return Array.from(cats).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    let products = mockProducts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.shop_name.toLowerCase().includes(query)
      );
    }

    if (filterCategory !== 'all') {
      products = products.filter((p) => p.category === filterCategory);
    }

    return products;
  }, [searchQuery, filterCategory]);

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts((prev) => prev.filter((p) => p !== id));
    } else {
      setSelectedProducts((prev) => [...prev, id]);
    }
  };

  const handleImportFromCampaign = () => {
    // Simulate importing products from a campaign
    const randomProducts = mockProducts.slice(0, 10).map((p) => p.id);
    setSelectedProducts(randomProducts);
    toast({
      title: 'Products Imported',
      description: `${randomProducts.length} products imported from campaign`,
    });
  };

  const handleImportByCategory = (category: string) => {
    const categoryProducts = mockProducts.filter((p) => p.category === category);
    setSelectedProducts(categoryProducts.map((p) => p.id));
    toast({
      title: 'Products Imported',
      description: `${categoryProducts.length} products from ${category}`,
    });
  };

  const handleGenerate = async () => {
    if (selectedProducts.length === 0 || !propertyId) {
      toast({
        title: 'Missing Configuration',
        description: 'Please select products and a channel',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setProgress({ completed: 0, total: selectedProducts.length });
    setResults([]);

    const property = availableProperties.find((p) => p.id === propertyId);
    const campaign = campaignId ? mockCampaigns.find((c) => c.id.toString() === campaignId) : null;

    try {
      const batchResult = await linkGeneratorService.batchGenerate(
        {
          productIds: selectedProducts,
          propertyId,
          propertyName: property?.name || 'Unknown',
          campaignId: campaign?.id,
          campaignName: campaign?.name,
          subIdPattern: subIdPattern || undefined,
        },
        (completed, total) => {
          setProgress({ completed, total });
        }
      );

      setResults(batchResult.results);
      setHasGenerated(true);

      toast({
        title: 'Generation Complete',
        description: `${batchResult.completed} links generated, ${batchResult.failed} failed`,
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAllLinks = async () => {
    const successfulLinks = results.filter((r) => r.status === 'success');
    const linksText = successfulLinks.map((r) => r.shortLink).join('\n');
    await navigator.clipboard.writeText(linksText);
    toast({
      title: 'Copied!',
      description: `${successfulLinks.length} links copied to clipboard`,
    });
  };

  const handleExportCSV = () => {
    const headers = ['Product ID', 'Product Name', 'Short Link', 'Status', 'Error'];
    const rows = results.map((r) => [
      r.productId,
      r.productName,
      r.shortLink,
      r.status,
      r.error || '',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-links-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Exported!',
      description: 'Results exported to CSV',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const successCount = results.filter((r) => r.status === 'success').length;
  const failedCount = results.filter((r) => r.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/links">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Link Generator</h1>
          <p className="text-muted-foreground">
            Generate multiple affiliate links at once
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel - Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Products</CardTitle>
            <CardDescription>
              Choose products to generate affiliate links for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Import Methods */}
            <Tabs value={importMethod} onValueChange={(v) => setImportMethod(v as typeof importMethod)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="manual" className="gap-2">
                  <ListFilter className="h-4 w-4" />
                  Manual
                </TabsTrigger>
                <TabsTrigger value="campaign" className="gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Campaign
                </TabsTrigger>
                <TabsTrigger value="category" className="gap-2">
                  <Tag className="h-4 w-4" />
                  Category
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedProducts.length === filteredProducts.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </Button>
                  <Badge variant="secondary">
                    {selectedProducts.length} selected
                  </Badge>
                </div>

                <ScrollArea className="h-[400px] rounded-lg border">
                  <div className="space-y-1 p-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted"
                      >
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => handleSelectProduct(product.id)}
                        />
                        <img
                          src={product.image_urls[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(product.price)} • {product.commission_rate}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="campaign" className="space-y-4">
                <Select value={selectedCampaignImport} onValueChange={setSelectedCampaignImport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCampaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id.toString()}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="w-full"
                  onClick={handleImportFromCampaign}
                  disabled={!selectedCampaignImport}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import Products from Campaign
                </Button>
                {selectedProducts.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {selectedProducts.length} products imported
                  </p>
                )}
              </TabsContent>

              <TabsContent value="category" className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleImportByCategory(cat)}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      {cat}
                      <Badge variant="secondary" className="ml-auto">
                        {mockProducts.filter((p) => p.category === cat).length}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Right Panel - Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Set up global settings for all generated links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="channel">Channel / Property *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="subIdPattern">Sub ID Pattern (Optional)</Label>
                <Input
                  id="subIdPattern"
                  placeholder="e.g., promo_{product_id}_{date}"
                  value={subIdPattern}
                  onChange={(e) => setSubIdPattern(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Available placeholders: {'{product_id}'}, {'{category}'}, {'{date}'}, {'{campaign}'}
                </p>
              </div>
            </div>

            <Separator />

            {/* Progress */}
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Generating links...</span>
                  <span>
                    {progress.completed} / {progress.total}
                  </span>
                </div>
                <Progress value={(progress.completed / progress.total) * 100} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={handleGenerate}
                disabled={selectedProducts.length === 0 || !propertyId || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Generate {selectedProducts.length} Links</>
                )}
              </Button>
              <Button
                variant="outline"
                disabled={isGenerating}
                onClick={() => {
                  setSelectedProducts([]);
                  setResults([]);
                  setHasGenerated(false);
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {hasGenerated && results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generation Results</CardTitle>
                <CardDescription>
                  {successCount} successful, {failedCount} failed
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyAllLinks}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All Links
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Generated Link</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.productId}>
                      <TableCell className="font-medium">{result.productName}</TableCell>
                      <TableCell>
                        {result.status === 'success' ? (
                          <code className="rounded bg-muted px-2 py-1 text-sm">
                            {result.shortLink}
                          </code>
                        ) : (
                          <span className="text-destructive">{result.error}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.status === 'success' ? (
                          <Badge className="gap-1 bg-success text-success-foreground">
                            <Check className="h-3 w-3" />
                            Success
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <X className="h-3 w-3" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
