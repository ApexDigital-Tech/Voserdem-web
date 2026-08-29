import React from 'react';
import { Donation } from '../types';

interface AdminDonationsProps {
  donations: Donation[];
}

export default function AdminDonations({ donations }: AdminDonationsProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-[#fcfbf9] border border-[#ebdccd]/65 rounded-3xl overflow-hidden shadow-xs">
        {donations.length === 0 ? (
          <div className="p-12 text-center text-[#5c544b]">
            No se registran donaciones aún en el data-store.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#ebdccd]/20 text-[10px] font-bold uppercase tracking-wider text-[#5c544b] border-b border-[#ebdccd]/30">
                  <th className="py-4 px-6">Donante</th>
                  <th className="py-4 px-6">Correo</th>
                  <th className="py-4 px-6">Esquema Destinatario</th>
                  <th className="py-4 px-6">Fecha Registro</th>
                  <th className="py-4 px-6 text-right">Monto (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebdccd]/30 text-xs text-[#1c1a17]">
                {donations.map((don) => (
                  <tr key={don.id} className="hover:bg-[#fbfaf7]">
                    <td className="py-4 px-6 font-bold">{don.donorName}</td>
                    <td className="py-4 px-6 font-medium text-[#4e4842]">{don.email}</td>
                    <td className="py-4 px-6 text-[#1f5f3d] font-semibold">
                      {don.projectTitle}
                    </td>
                    <td className="py-4 px-6 text-[#5c544b] font-mono">
                      {new Date(don.date).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-[#d95c2b]">
                      ${don.amount.toLocaleString()} USD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
