"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";

export default function DashboardPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quotesData, policiesData] = await Promise.all([
          apiClient.getQuotes(),
          apiClient.getPolicies(),
        ]);
        setQuotes(quotesData);
        setPolicies(policiesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Hoş geldiniz! İşte özet bilgileriniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Toplam Teklif"
          value={quotes.length}
          description="Aldığınız teklif sayısı"
        />
        <StatCard
          title="Aktif Poliçe"
          value={policies.filter((p) => p.status === "active").length}
          description="Aktif poliçe sayısı"
        />
        <StatCard
          title="Bekleyen Poliçe"
          value={policies.filter((p) => p.status === "pending").length}
          description="İşleme alınmayı bekleyen"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son Teklifler</CardTitle>
          </CardHeader>
          <CardContent>
            {quotes.length === 0 ? (
              <p className="text-gray-500">Henüz teklif yok</p>
            ) : (
              <div className="space-y-3">
                {quotes.slice(0, 5).map((quote) => (
                  <div
                    key={quote.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{quote.provider}</p>
                      <p className="text-sm text-gray-600">
                        {quote.product_type}
                      </p>
                    </div>
                    <p className="font-semibold text-blue-600">
                      ₺{quote.premium_gross.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Son Poliçeler</CardTitle>
          </CardHeader>
          <CardContent>
            {policies.length === 0 ? (
              <p className="text-gray-500">Henüz poliçe yok</p>
            ) : (
              <div className="space-y-3">
                {policies.slice(0, 5).map((policy) => (
                  <div
                    key={policy.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{policy.provider}</p>
                      <p className="text-sm text-gray-600">
                        {policy.policy_number || "Beklemede"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        policy.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {policy.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
