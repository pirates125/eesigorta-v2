"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KaskoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kasko Sigortası</h1>
        <p className="text-gray-600 mt-1">
          Araç bilgilerinizi girerek kasko teklifi alın
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kasko Teklif Formu</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">
            Kasko teklif alma özelliği yakında eklenecek
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
