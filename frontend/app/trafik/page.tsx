"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";

export default function TrafikPage() {
  const [formData, setFormData] = useState({
    // Müşteri bilgileri
    customer_name: "",
    customer_tckn: "",
    customer_phone: "",

    // Araç bilgileri
    vehicle_plate: "",

    // Provider seçimi
    providers: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");

  const availableProviders = [
    { id: "sompo", name: "Sompo Sigorta" },
    { id: "quick", name: "Quick Sigorta" },
    { id: "axa", name: "Axa Sigorta" },
    { id: "anadolu", name: "Anadolu Sigorta" },
  ];

  const toggleProvider = (providerId: string) => {
    setFormData((prev) => ({
      ...prev,
      providers: prev.providers.includes(providerId)
        ? prev.providers.filter((p) => p !== providerId)
        : [...prev.providers, providerId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.providers.length === 0) {
      setError("Lütfen en az bir sigorta şirketi seçin");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      // Her provider için paralel olarak teklif al
      const quotePromises = formData.providers.map(async (provider) => {
        try {
          const quote = await apiClient.createQuote({
            provider,
            product_type: "trafik",
            vehicle_plate: formData.vehicle_plate,
            tckn: formData.customer_tckn,
          });
          return { ...quote, success: true, provider };
        } catch (err: any) {
          return {
            success: false,
            provider,
            error: err.message || "Teklif alınamadı",
          };
        }
      });

      const allResults = await Promise.all(quotePromises);
      setResults(allResults);

      const successCount = allResults.filter((r) => r.success).length;
      if (successCount === 0) {
        setError("Hiçbir şirketten teklif alınamadı");
      }
    } catch (err: any) {
      setError(err.message || "Beklenmeyen bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async (quoteId: string, provider: string) => {
    try {
      await apiClient.createPolicy(quoteId);
      alert(`${provider} için poliçe oluşturuldu!`);
    } catch (err: any) {
      alert(`Poliçe oluşturulamadı: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Trafik Sigortası Teklif Al
        </h1>
        <p className="text-gray-600 mt-1">
          Müşteri ve araç bilgilerini girerek birden fazla şirketten teklif alın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teklif Formu */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Teklif Formu</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Müşteri Bilgileri */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Müşteri Bilgileri
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Ad Soyad *</Label>
                    <Input
                      id="customer_name"
                      placeholder="Ahmet Yılmaz"
                      value={formData.customer_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer_name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_tckn">TC Kimlik No *</Label>
                    <Input
                      id="customer_tckn"
                      placeholder="12345678901"
                      maxLength={11}
                      value={formData.customer_tckn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer_tckn: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Telefon *</Label>
                    <Input
                      id="customer_phone"
                      placeholder="5xxxxxxxxx"
                      value={formData.customer_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer_phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Araç Bilgileri */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Araç Bilgileri
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_plate">Araç Plakası *</Label>
                    <Input
                      id="vehicle_plate"
                      placeholder="34ABC123"
                      value={formData.vehicle_plate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicle_plate: e.target.value.toUpperCase(),
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Sigorta Şirketleri Seçimi */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Teklif Alınacak Şirketler *
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {availableProviders.map((provider) => (
                    <label
                      key={provider.id}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.providers.includes(provider.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.providers.includes(provider.id)}
                        onChange={() => toggleProvider(provider.id)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">{provider.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Teklifler alınıyor...
                  </span>
                ) : (
                  `${formData.providers.length} Şirketten Teklif Al`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Teklifler veya Loading */}
        <div className="space-y-4">
          {loading && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <div>
                    <p className="font-medium">Teklifler alınıyor...</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.providers.length} şirket sorgulanıyor
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Bu işlem 1-2 dakika sürebilir
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                Teklif Sonuçları ({results.length})
              </h3>

              {results.map((result, index) => (
                <Card
                  key={index}
                  className={
                    result.success ? "border-green-200" : "border-red-200"
                  }
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {
                          availableProviders.find(
                            (p) => p.id === result.provider
                          )?.name
                        }
                      </CardTitle>
                      {result.success ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Başarılı
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          Hata
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.success ? (
                      <>
                        <div>
                          <p className="text-xs text-gray-600">Net Prim</p>
                          <p className="text-lg font-bold text-blue-600">
                            ₺{result.premium_net?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">
                            Brüt Prim (Toplam)
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            ₺{result.premium_gross?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                        <Button
                          onClick={() =>
                            handleCreatePolicy(result.id, result.provider)
                          }
                          className="w-full"
                          variant="outline"
                          size="sm"
                        >
                          Poliçe Kes
                        </Button>
                      </>
                    ) : (
                      <p className="text-sm text-red-600">{result.error}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
