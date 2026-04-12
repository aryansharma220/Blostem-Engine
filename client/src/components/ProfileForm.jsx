import { useState } from "react";
import { Icon } from "./IconSystem";
import { goalOptions, liquidityOptions, riskOptions } from "../utils/labels";

const initialState = {
  ageGroup: "20-30",
  incomeRange: "3-6L",
  goal: "short_term",
  horizon: "6-12 months",
  liquidityNeed: "high",
  riskLevel: "low",
};

const options = {
  ageGroup: [
    { value: "18-20", label: "18-20" },
    { value: "20-30", label: "20-30" },
    { value: "30-45", label: "30-45" },
    { value: "45+", label: "45+" },
  ],
  incomeRange: [
    { value: "0-3L", label: "0-3L" },
    { value: "3-6L", label: "3-6L" },
    { value: "6-12L", label: "6-12L" },
    { value: "12L+", label: "12L+" },
  ],
  goal: goalOptions,
  horizon: [
    { value: "0-6 months", label: "0-6 months" },
    { value: "6-12 months", label: "6-12 months" },
    { value: "12-24 months", label: "12-24 months" },
    { value: "24+ months", label: "24+ months" },
  ],
  liquidityNeed: liquidityOptions,
  riskLevel: riskOptions,
};

function SelectField({ label, name, value, onChange, values }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
      {label}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="surface-input rounded-2xl p-3 text-sm shadow-sm shadow-cyan-950/10 outline-none transition"
        aria-label={label}
      >
        {values.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ProfileForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-950/15 backdrop-blur-xl md:p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
            <Icon name="shield" className="h-4 w-4" />
            [ Input Profile ]
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Shape the recommendation lens</h2>
        </div>
        <p className="text-sm text-slate-300">6 inputs, one ranked decision set</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <SelectField label="Age Group" name="ageGroup" value={form.ageGroup} onChange={handleChange} values={options.ageGroup} />
        <SelectField label="Income Range" name="incomeRange" value={form.incomeRange} onChange={handleChange} values={options.incomeRange} />
        <SelectField label="Investment Goal" name="goal" value={form.goal} onChange={handleChange} values={options.goal} />
        <SelectField label="Time Horizon" name="horizon" value={form.horizon} onChange={handleChange} values={options.horizon} />
        <SelectField label="Liquidity Need" name="liquidityNeed" value={form.liquidityNeed} onChange={handleChange} values={options.liquidityNeed} />
        <SelectField label="Risk Appetite" name="riskLevel" value={form.riskLevel} onChange={handleChange} values={options.riskLevel} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-500"
      >
        <Icon name="spark" className="h-4 w-4" />
        {loading ? "Analyzing..." : "Get Recommendations"}
      </button>
    </form>
  );
}
