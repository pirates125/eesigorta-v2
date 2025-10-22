"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";

export default function TekliflerPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const data = await apiClient.getQuotes();
        setQuotes(data);
      } catch (err) {
        console.error("Failed to fetch quotes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tekliflerim</h1>
        <p className="text-gray-600 mt-1">Aldığınız tüm teklifler</p>
      </div>

      {quotes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Henüz teklif almadınız</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map((quote) => (
            <Card key={quote.id}>
              <CardHeader>
                <CardTitle className="text-lg">{quote.provider}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Ürün Tipi</p>
                    <p className="font-medium capitalize">
                      {quote.product_type}
                    </p>
                  </div>
                  {quote.vehicle_plate && (
                    <div>
                      <p className="text-sm text-gray-600">Plaka</p>
                      <p className="font-medium">{quote.vehicle_plate}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Brüt Prim</p>
                    <p className="text-xl font-bold text-blue-600">
                      ₺{quote.premium_gross.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {new Date(quote.created_at).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
