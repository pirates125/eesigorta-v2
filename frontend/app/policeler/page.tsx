"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";

export default function PolicesPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const data = await apiClient.getPolicies();
        setPolicies(data);
      } catch (err) {
        console.error("Failed to fetch policies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Poliçelerim</h1>
        <p className="text-gray-600 mt-1">Tüm poliçeleriniz</p>
      </div>

      {policies.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Henüz poliçeniz yok</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {policies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{policy.provider}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {policy.policy_number || "Poliçe numarası bekleniyor"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      policy.status === "active"
                        ? "bg-green-100 text-green-700"
                        : policy.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {policy.status === "active" && "Aktif"}
                    {policy.status === "pending" && "Beklemede"}
                    {policy.status === "cancelled" && "İptal"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Başlangıç</p>
                    <p className="font-medium">
                      {policy.start_date
                        ? new Date(policy.start_date).toLocaleDateString(
                            "tr-TR"
                          )
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bitiş</p>
                    <p className="font-medium">
                      {policy.end_date
                        ? new Date(policy.end_date).toLocaleDateString("tr-TR")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Oluşturma</p>
                    <p className="font-medium">
                      {new Date(policy.created_at).toLocaleDateString("tr-TR")}
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
