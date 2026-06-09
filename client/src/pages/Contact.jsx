import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [feedback, setFeedback] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);
    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Erreur lors de l'envoi du message.");
      }

      setFeedback({ type: "success", message: "Message envoyé avec succès !" });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Contact</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Contactez l'équipe Romolayte</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Utilisez ce formulaire pour envoyer une demande générale ou poser une question rapide.
        </p>

        {feedback && (
          <div className={`mt-6 rounded-3xl p-4 text-sm ${feedback.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Nom
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Votre nom"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Email
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="email@exemple.com"
              />
            </label>
          </div>
          <label className="space-y-2 text-sm text-slate-700">
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="min-h-[160px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Votre message..."
            />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="inline-flex rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Envoi…" : "Envoyer le message"}
          </button>
        </form>
      </section>

      <aside className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-slate-800 p-8 text-white shadow-soft">
        <h2 className="text-2xl font-semibold">Besoin d'aide ?</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Notre équipe est disponible pour accompagner votre projet et répondre à toutes vos questions.
        </p>
        <div className="mt-8 space-y-4 rounded-3xl bg-slate-900/80 p-6">
          <div>
            <p className="text-sm text-slate-400">Email</p>
            <p className="mt-2 font-semibold text-white">support@romolayte.com</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Téléphone</p>
            <p className="mt-2 font-semibold text-white">+33 1 23 45 67 89</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
