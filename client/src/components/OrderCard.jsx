import {
  Mail,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
} from "lucide-react";

export default function OrderCard({ order, onView }) {
  const phoneRaw = order.phone ? order.phone.replace(/\D/g, "") : "";
  const status = order.status || "pending";

  const statusColors = {
    received: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">
            {order.service_name}
          </h3>
          <p className="text-sm text-slate-500">
            {order.category_name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              statusColors[status]
            }`}
          >
            {status}
          </span>

          <button
            className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-600"
            onClick={() => onView?.(order)}
          >
            Update
          </button>
        </div>
      </div>

      {/* CLIENT */}
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">
          👤 {order.name}
        </p>

        <a href={`mailto:${order.email}`} className="flex items-center gap-2 text-indigo-600 hover:underline">
          <Mail size={16} />
          {order.email}
        </a>

        <a href={`tel:${order.phone}`} className="flex items-center gap-2 text-indigo-600 hover:underline">
          <Phone size={16} />
          {order.phone}
        </a>

        {order.location && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-indigo-600 hover:underline"
          >
            <MapPin size={16} />
            {order.location}
          </a>
        )}

        {order.coordinates && (
          <a
            href={`https://www.google.com/maps?q=${order.coordinates}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-indigo-600 hover:underline"
          >
            <Globe size={16} />
            GPS: {order.coordinates}
          </a>
        )}
      </div>

      {/* PRICE */}
      {order.price && (
        <p className="mt-4 text-lg font-bold text-emerald-600">
          ${order.price}
        </p>
      )}

      {/* INFO */}
      {order.other_info && (
        <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
          {order.other_info}
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-5 flex flex-wrap gap-2">

        {phoneRaw && (
          <a
            href={`https://wa.me/${phoneRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        )}

        <a
          href={`tel:${order.phone}`}
          className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Phone size={16} />
          Appeler
        </a>

        <a
          href={`mailto:${order.email}`}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Mail size={16} />
          Email
        </a>
      </div>
    </div>
  );
}