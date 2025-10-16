import React, { useMemo, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Switch } from "./components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "./components/ui/select";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Slider } from "./components/ui/slider";
import { Download, RefreshCw, Calendar, Users, Sun, Moon, Clock, Plus, Minus, SlidersHorizontal, Activity, TrendingUp, Upload } from "lucide-react";
import { CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Line, XAxis, YAxis } from "recharts";

const WEEKDAYS = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"];

const AGENTS = [
  { name: "Rida", country: "PK", remote: true,  days: 6, level: "mid", fridayAllowed: true, breakPref: "none" },
  { name: "Shaimaa", country: "EG", remote: true,  days: 6, level: "senior", fridayAllowed: true, breakPref: "60" },
  { name: "Fatma", country: "EG", remote: true,  days: 6, level: "senior", fridayAllowed: true, breakPref: "60" },
  { name: "Abdulaziz", country: "SA", remote: false, days: 5, level: "junior", fridayAllowed: false, breakPref: "none" },
  { name: "Othman", country: "SA", remote: false, days: 5, level: "junior", fridayAllowed: false, breakPref: "60" },
  { name: "Aisha", country: "SA", remote: false, days: 5, level: "senior", fridayAllowed: false, breakPref: "none" },
  { name: "Haneen", country: "SA", remote: false, days: 5, level: "junior", fridayAllowed: false, breakPref: "none" },
  { name: "Maha", country: "SA", remote: false, days: 5, level: "senior", fridayAllowed: false, breakPref: "none" },
  { name: "Rawan", country: "SA", remote: false, days: 5, level: "senior", fridayAllowed: false, breakPref: "none" }
];

const HOURLY_LOAD_PCT_DEFAULT = [
  4.04,3.12,2.29,1.96,1.34,1.14,1.15,1.54,2.00,2.04,4.62,4.30,4.50,4.93,5.09,5.29,5.54,5.66,5.85,6.64,6.22,6.05,5.17,4.90
];

const DAILY_AVG_DEFAULT = {
  Sunday: 822, Monday: 700, Tuesday: 627, Wednesday: 587, Thursday: 672, Friday: 560, Saturday: 780
};

const DEFAULT_DAY = { active: false, startMin: 9*60, endMin: 17*60, breakStartMin: 13*60, breakMins: 60 };

function seedRoster() {
  const r = {};
  const S = {
    Rida: { Saturday:{s:5*60,e:14*60}, Sunday:{s:5*60,e:14*60}, Monday:{s:5*60,e:14*60}, Tuesday:{s:5*60,e:14*60}, Wednesday:{s:0,e:0,active:false}, Thursday:{s:5*60,e:14*60}, Friday:{s:5*60,e:14*60} },
    Shaimaa: { Saturday:{s:12*60,e:21*60}, Sunday:{s:12*60,e:21*60}, Monday:{s:12*60,e:21*60}, Tuesday:{s:12*60,e:21*60}, Wednesday:{s:12*60,e:21*60}, Thursday:{s:12*60,e:21*60}, Friday:{s:0,e:0,active:false} },
    Fatma: { Saturday:{s:15*60,e:24*60-1}, Sunday:{s:15*60,e:24*60-1}, Monday:{s:0,e:0,active:false}, Tuesday:{s:15*60,e:24*60-1}, Wednesday:{s:15*60,e:24*60-1}, Thursday:{s:15*60,e:24*60-1}, Friday:{s:15*60,e:24*60-1} },
    Abdulaziz: { Saturday:{s:8*60,e:17*60}, Sunday:{s:8*60,e:17*60}, Monday:{s:8*60,e:17*60}, Tuesday:{s:0,e:0,active:false}, Wednesday:{s:8*60,e:17*60}, Thursday:{s:8*60,e:17*60}, Friday:{s:0,e:0,active:false} },
    Othman: { Saturday:{s:11*60,e:20*60}, Sunday:{s:11*60,e:20*60}, Monday:{s:11*60,e:20*60}, Tuesday:{s:11*60,e:20*60}, Wednesday:{s:0,e:0,active:false}, Thursday:{s:11*60,e:20*60}, Friday:{s:0,e:0,active:false} },
    Aisha: { Saturday:{s:0,e:0,active:false}, Sunday:{s:9*60,e:17*60}, Monday:{s:9*60,e:17*60}, Tuesday:{s:9*60,e:17*60}, Wednesday:{s:9*60,e:17*60}, Thursday:{s:10*60,e:18*60}, Friday:{s:0,e:0,active:false} },
    Haneen: { Saturday:{s:8*60,e:16*60}, Sunday:{s:8*60,e:16*60}, Monday:{s:0,e:0,active:false}, Tuesday:{s:8*60,e:16*60}, Wednesday:{s:8*60,e:16*60}, Thursday:{s:8*60,e:16*60}, Friday:{s:0,e:0,active:false} },
    Maha: { Saturday:{s:9*60,e:17*60}, Sunday:{s:9*60,e:17*60}, Monday:{s:9*60,e:17*60}, Tuesday:{s:9*60,e:17*60}, Wednesday:{s:9*60,e:17*60}, Thursday:{s:0,e:0,active:false}, Friday:{s:0,e:0,active:false} },
    Rawan: { Saturday:{s:8*60,e:16*60+30}, Sunday:{s:8*60,e:16*60+30}, Monday:{s:8*60,e:16*60+30}, Tuesday:{s:8*60,e:16*60+30}, Wednesday:{s:8*60,e:16*60+30}, Thursday:{s:0,e:0,active:false}, Friday:{s:0,e:0,active:false} }
  };
  AGENTS.forEach(a => {
    r[a.name] = {};
    WEEKDAYS.forEach(d => {
      const preset = S[a.name] && S[a.name][d];
      const active = preset && preset.active === false ? false : !!preset;
      const startMin = (preset && preset.s) ?? DEFAULT_DAY.startMin;
      const endMin = (preset && preset.e) ?? DEFAULT_DAY.endMin;
      const breakMins = a.breakPref === "60" ? 60 : 0;
      const breakStartMin = breakMins ? Math.max(startMin, Math.floor((startMin+endMin)/2) - 30) : undefined;
      r[a.name][d] = { active, startMin, endMin, breakStartMin, breakMins };
    });
  });
  return r;
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function hourCoverage(roster, day) {
  const cov = Array(24).fill(0);
  AGENTS.forEach(a => {
    const blk = roster[a.name][day];
    if (!blk.active) return;
    for (let h=0; h<24; h++) {
      const hs = h*60, he = (h+1)*60;
      const workOverlap = Math.max(0, Math.min(blk.endMin, he) - Math.max(blk.startMin, hs));
      let breakOverlap = 0;
      if ((blk.breakMins||0) > 0 && blk.breakStartMin !== undefined) {
        const bs = blk.breakStartMin, be = blk.breakStartMin + (blk.breakMins||0);
        breakOverlap = Math.max(0, Math.min(be, he) - Math.max(bs, hs));
      }
      const net = workOverlap - breakOverlap;
      if (net > 0) cov[h]++;
    }
  });
  return cov;
}

function toHHMM(m) { const hh = String(Math.floor(m/60)).padStart(2,"0"); const mm = String(m%60).padStart(2,"0"); return `${hh}:${mm}`; }

function exportCSV(roster) {
  const header = ["agent","day","active","start","end","break_start","break_minutes"];
  const rows = [];
  AGENTS.forEach(a => {
    WEEKDAYS.forEach(d => {
      const blk = roster[a.name][d];
      rows.push([
        a.name,
        d,
        blk.active?"1":"0",
        toHHMM(blk.startMin),
        toHHMM(blk.endMin),
        blk.breakStartMin!==undefined?toHHMM(blk.breakStartMin):"",
        String(blk.breakMins||0)
      ].join(","));
    });
  });
  return [header.join(","), ...rows].join("\\n");
}

function requiredAgentsPerHour(ticketsPerHour, ahtMin, occupancy) {
  return Math.ceil((ticketsPerHour * (ahtMin/60)) / Math.max(0.1, occupancy));
}

function parseCSV(text) {
  const lines = text.trim().split(/\\r?\\n/);
  const headers = lines[0].split(",").map(h=>h.trim());
  const rows = lines.slice(1).map(line => {
    const parts = line.split(",").map(c=>c.trim());
    const obj = {};
    headers.forEach((h,i)=>{ obj[h]=parts[i]||""; });
    return obj;
  });
  return { headers, rows };
}

export default function App() {
  const [roster, setRoster] = useState(() => seedRoster());
  const [selectedDay, setSelectedDay] = useState("Sunday");
  const [levelFilter, setLevelFilter] = useState("all");
  const [dark, setDark] = useState(false);
  const [ahtMin, setAhtMin] = useState(6);
  const [occupancy, setOccupancy] = useState(0.85);
  const [serviceBuffer, setServiceBuffer] = useState(0);
  const [intradayDelta, setIntradayDelta] = useState(Array(24).fill(0));
  const [dailyAvg, setDailyAvg] = useState({ ...DAILY_AVG_DEFAULT });
  const [hourlyPctByDay, setHourlyPctByDay] = useState({
    Saturday:[...HOURLY_LOAD_PCT_DEFAULT], Sunday:[...HOURLY_LOAD_PCT_DEFAULT], Monday:[...HOURLY_LOAD_PCT_DEFAULT], Tuesday:[...HOURLY_LOAD_PCT_DEFAULT], Wednesday:[...HOURLY_LOAD_PCT_DEFAULT], Thursday:[...HOURLY_LOAD_PCT_DEFAULT], Friday:[...HOURLY_LOAD_PCT_DEFAULT]
  });

  const coverage = useMemo(()=>hourCoverage(roster, selectedDay), [roster, selectedDay]);
  const demandCurve = useMemo(()=>{
    const arr = hourlyPctByDay[selectedDay];
    const sum = arr.reduce((a,b)=>a+b,0) || 1;
    const base = dailyAvg[selectedDay];
    return arr.map(p => base * (p/sum));
  }, [selectedDay, hourlyPctByDay, dailyAvg]);
  const required = useMemo(()=>demandCurve.map(v => requiredAgentsPerHour(v, ahtMin, occupancy) + serviceBuffer), [demandCurve, ahtMin, occupancy, serviceBuffer]);
  const coverageWithDelta = useMemo(()=>coverage.map((c,h)=> c + (intradayDelta[h]||0)), [coverage, intradayDelta]);

  const chartData = useMemo(() => {
    const maxCov = Math.max(1, ...coverageWithDelta, ...required);
    const arr = hourlyPctByDay[selectedDay];
    const sum = arr.reduce((a,b)=>a+b,0) || 1;
    const scale = maxCov / Math.max(...arr.map(v=>v/sum));
    return Array.from({length:24}, (_,h)=>({
      hour:h,
      coverage: coverageWithDelta[h],
      required: required[h],
      load: +(((arr[h]/sum))*scale).toFixed(2)
    }));
  }, [coverageWithDelta, required, selectedDay, hourlyPctByDay]);

  const onImport = async (file) => {
    const text = await file.text();
    const { headers, rows } = parseCSV(text);
    const hset = headers.map(h=>h.toLowerCase());
    if (hset.includes("ticket created - day of week") && hset.some(h=>h.includes("daily"))) {
      const map = { ...dailyAvg };
      rows.forEach(r=>{
        const d = (r[headers[0]]||"").trim();
        const v = parseFloat(r[headers[1]]||"0");
        if (WEEKDAYS.includes(d)) map[d] = isFinite(v) ? v : map[d];
      });
      setDailyAvg(map);
      return;
    }
    const wdCols = WEEKDAYS.filter(d=> headers.some(h=>h.toLowerCase()===d.toLowerCase()));
    if (headers.map(h=>h.toLowerCase()).includes("hour") && wdCols.length>=1) {
      const next = { Saturday:[], Sunday:[], Monday:[], Tuesday:[], Wednesday:[], Thursday:[], Friday:[] };
      WEEKDAYS.forEach(d=>{ next[d]=Array(24).fill(0); });
      rows.forEach(r=>{
        const hourCol = headers.find(h=>h.toLowerCase()==="hour") || "hour";
        const h = parseInt(r[hourCol]||"0",10);
        WEEKDAYS.forEach(d=>{
          const key = headers.find(h=>h.toLowerCase()===d.toLowerCase());
          const v = parseFloat(key? r[key]||"0" : "0");
          if (h>=0 && h<24 && isFinite(v)) next[d][h]=v;
        });
      });
      const norm = { Saturday:[], Sunday:[], Monday:[], Tuesday:[], Wednesday:[], Thursday:[], Friday:[] };
      WEEKDAYS.forEach(d=>{
        const s = next[d].reduce((a,b)=>a+b,0) || 1;
        norm[d] = next[d].map(v=> (v/s)*100);
      });
      setHourlyPctByDay(norm);
      return;
    }
    if (headers.length===2 && headers[0].toLowerCase().includes("hour")) {
      const arr = Array(24).fill(0);
      rows.forEach(r=>{ const h=parseInt(r[headers[0]]||"0",10); const v=parseFloat(r[headers[1]]||"0"); if(h>=0&&h<24&&isFinite(v)) arr[h]=v; });
      const s = arr.reduce((a,b)=>a+b,0) || 1;
      const pct = arr.map(v=> (v/s)*100);
      const next = { Saturday:[...pct], Sunday:[...pct], Monday:[...pct], Tuesday:[...pct], Wednesday:[...pct], Thursday:[...pct], Friday:[...pct] };
      setHourlyPctByDay(next);
      return;
    }
  };

  const exportNow = () => {
    const csv = exportCSV(roster);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "CS_Roster_Hourly.csv";
    document.body.appendChild(a);
    setTimeout(() => {
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div className={`w-full min-h-screen p-6 ${dark?"bg-zinc-950 text-zinc-100":"bg-white text-zinc-900"}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sharbatly CS WFM</h1>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="rounded-2xl px-3 py-1">Saudi TZ</Badge>
          <div className="flex items-center gap-2"><Sun className="w-4 h-4"/><Switch checked={dark} onCheckedChange={setDark}/><Moon className="w-4 h-4"/></div>
          <div className="hidden md:flex items-center gap-2">
            <input id="csvfile" type="file" accept=".csv" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) onImport(f); }} />
            <Button variant="outline" onClick={()=>document.getElementById("csvfile")?.click()}><Upload className="w-4 h-4 mr-2"/>Import CSV</Button>
          </div>
          <Button variant="outline" onClick={()=>window.location.reload()}><RefreshCw className="w-4 h-4 mr-2"/>Auto plan</Button>
          <Button onClick={exportNow}><Download className="w-4 h-4 mr-2"/>Export CSV</Button>
        </div>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="intraday">Intraday</TabsTrigger>
          <TabsTrigger value="adherence">Adherence</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <ScheduleTab roster={roster} setRoster={setRoster} selectedDay={selectedDay} setSelectedDay={setSelectedDay} levelFilter={""} setLevelFilter={()=>{}} coverageDataInputs={{coverage: hourCoverage(roster, selectedDay), hourlyPct: hourlyPctByDay[selectedDay], dailyAvg: dailyAvg[selectedDay]}} />
        </TabsContent>

        <TabsContent value="forecast">
          <ForecastTab selectedDay={selectedDay} setSelectedDay={setSelectedDay} ahtMin={ahtMin} setAhtMin={setAhtMin} occupancy={occupancy} setOccupancy={setOccupancy} buffer={serviceBuffer} setBuffer={setServiceBuffer} chartDataInputs={{hourlyPctByDay, dailyAvg, coverage: hourCoverage(roster, selectedDay)}} />
        </TabsContent>

        <TabsContent value="intraday">
          <IntradayTab selectedDay={selectedDay} intradayDelta={intradayDelta} setIntradayDelta={setIntradayDelta} />
        </TabsContent>

        <TabsContent value="adherence">
          <AdherenceTab roster={roster} selectedDay={selectedDay} />
        </TabsContent>

      </Tabs>
    </div>
  );
}

function ScheduleTab({ roster, setRoster, selectedDay, setSelectedDay, levelFilter, setLevelFilter, coverageDataInputs }) {
  const { coverage, hourlyPct, dailyAvg } = coverageDataInputs;
  const intradayZero = Array(24).fill(0);
  const sum = hourlyPct.reduce((a,b)=>a+b,0) || 1;
  const required = hourlyPct.map(p => requiredAgentsPerHour(dailyAvg * (p/sum), 6, 0.85));
  const coverageWithDelta = coverage.map((c,i)=> c + intradayZero[i]);
  const maxCov = Math.max(1, ...coverageWithDelta, ...required);
  const scale = maxCov / Math.max(...hourlyPct.map(v=> (v/sum)));
  const chartData = Array.from({length:24}, (_,h)=>({ hour:h, coverage: coverageWithDelta[h], required: required[h], load: +(((hourlyPct[h]/sum))*scale).toFixed(2) }));

  const toggleActive = (name, day) => setRoster((prev) => ({
    ...prev,
    [name]: { ...prev[name], [day]: { ...prev[name][day], active: !prev[name][day].active } }
  }));
  const setField = (name, day, field, value) => setRoster((prev) => {
    const blk = { ...prev[name][day] };
    if (field === "startMin") blk.startMin = Math.max(0, Math.min(24*60, value));
    else if (field === "endMin") blk.endMin = Math.max(0, Math.min(24*60, value));
    else if (field === "breakStartMin") blk.breakStartMin = Math.max(0, Math.min(24*60, value));
    else if (field === "breakMins") blk.breakMins = Math.max(0, Math.min(180, value));
    if (blk.endMin < blk.startMin) blk.endMin = blk.startMin;
    return ({ ...prev, [name]: { ...prev[name], [day]: blk } });
  });

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 md:col-span-4 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar className="w-4 h-4"/>Select day</div>
          <Select value={selectedDay} onValueChange={(v)=>setSelectedDay(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {WEEKDAYS.map(d=> <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-sm text-gray-500"><Users className="w-4 h-4"/>Filter by level</div>
          <Tabs value={"all"} onValueChange={()=>{}}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="senior">Senior</TabsTrigger>
              <TabsTrigger value="mid">Mid</TabsTrigger>
              <TabsTrigger value="junior">Junior</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="col-span-12 md:col-span-8 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2"><Clock className="w-4 h-4"/>Coverage vs. required ({selectedDay})</div>
          <div className="w-full h-56">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="coverage" name="Agents covering" fill="#22c55e" />
                <Bar dataKey="required" name="Required agents" fill="#ef4444" />
                <Line type="monotone" dataKey="load" name="Ticket load (scaled)" dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12 shadow-sm">
        <CardContent className="p-4">
          <div className="mb-3 font-medium">{selectedDay} — Agent hours & break</div>
          <div className="grid gap-2" style={{ gridTemplateColumns: "220px 70px 110px 110px 130px 110px 1fr" }}>
            <div className="text-xs font-semibold">Agent</div>
            <div className="text-xs font-semibold text-center">Active</div>
            <div className="text-xs font-semibold">Start</div>
            <div className="text-xs font-semibold">End</div>
            <div className="text-xs font-semibold">Break start</div>
            <div className="text-xs font-semibold">Break (min)</div>
            <div className="text-xs font-semibold">Hourly timeline</div>
            {AGENTS.map(a=>{
              const blk = roster[a.name][selectedDay];
              return (
                <React.Fragment key={a.name+selectedDay}>
                  <div className="py-2 pr-3 text-sm">
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs opacity-70">{a.level} · {a.remote?"remote":"on-site"} · {a.country}</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Switch checked={blk.active} onCheckedChange={()=>toggleActive(a.name, selectedDay)} />
                  </div>
                  <TimeInput value={blk.startMin} onChange={(v)=>setField(a.name, selectedDay, "startMin", v)} disabled={!blk.active} />
                  <TimeInput value={blk.endMin} onChange={(v)=>setField(a.name, selectedDay, "endMin", v)} disabled={!blk.active} />
                  <TimeInput value={blk.breakStartMin ?? 13*60} onChange={(v)=>setField(a.name, selectedDay, "breakStartMin", v)} disabled={!blk.active} />
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon" onClick={()=>setField(a.name, selectedDay, "breakMins", Math.max(0,(blk.breakMins||0)-15))} disabled={!blk.active}><Minus className="w-3 h-3"/></Button>
                    <Input type="number" className="h-9" value={blk.breakMins||0} min={0} max={180} step={15} onChange={e=>setField(a.name, selectedDay, "breakMins", parseInt(e.target.value||"0",10))} disabled={!blk.active}/>
                    <Button type="button" variant="outline" size="icon" onClick={()=>setField(a.name, selectedDay, "breakMins", Math.min(180,(blk.breakMins||0)+15))} disabled={!blk.active}><Plus className="w-3 h-3"/></Button>
                  </div>
                  <TimelineRow block={blk} />
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12 shadow-sm">
        <CardContent className="p-4">
          <div className="mb-2 text-sm text-gray-500">Hourly coverage ({selectedDay})</div>
          <CoverageHeatbarSimple coverage={coverage} />
        </CardContent>
      </Card>
    </div>
  );
}

function ForecastTab({ selectedDay, setSelectedDay, ahtMin, setAhtMin, occupancy, setOccupancy, buffer, setBuffer, chartDataInputs }) {
  const { hourlyPctByDay, dailyAvg, coverage } = chartDataInputs;
  const arr = hourlyPctByDay[selectedDay];
  const sum = arr.reduce((a,b)=>a+b,0) || 1;
  const required = arr.map(p => requiredAgentsPerHour(dailyAvg[selectedDay]*(p/sum), ahtMin, occupancy) + buffer);
  const maxCov = Math.max(1, ...coverage, ...required);
  const scale = maxCov / Math.max(...arr.map(v=> v/sum));
  const chartData = Array.from({length:24}, (_,h)=>({ hour:h, required: required[h], coverage: coverage[h]||0, load: +(((arr[h]/sum))*scale).toFixed(2) }));

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 md:col-span-4 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500"><SlidersHorizontal className="w-4 h-4"/>Forecast settings</div>
          <div className="text-xs text-gray-500">AHT (min)</div>
          <Input type="number" value={ahtMin} min={1} max={60} onChange={e=>setAhtMin(parseFloat(e.target.value||"6"))} />
          <div className="text-xs text-gray-500">Occupancy target</div>
          <Slider value={[Math.round(occupancy*100)]} min={50} max={95} step={1} onValueChange={([v])=>setOccupancy(v/100)} />
          <div className="text-xs">{Math.round(occupancy*100)}%</div>
          <div className="text-xs text-gray-500">Buffer (extra agents per hour)</div>
          <Input type="number" value={buffer} min={0} max={10} onChange={e=>setBuffer(parseInt(e.target.value||"0",10))} />
          <div className="text-xs text-gray-500">Day</div>
          <Select value={selectedDay} onValueChange={(v)=>setSelectedDay(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {WEEKDAYS.map(d=> <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="col-span-12 md:col-span-8 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2"><Activity className="w-4 h-4"/>Demand vs Required vs Coverage ({selectedDay})</div>
          <div className="w-full h-56">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="required" name="Required" fill="#ef4444" />
                <Bar dataKey="coverage" name="Coverage" fill="#22c55e" />
                <Line type="monotone" dataKey="load" name="Load (scaled)" dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function IntradayTab({ selectedDay, intradayDelta, setIntradayDelta }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4"><TrendingUp className="w-4 h-4"/>Intraday staffing deltas ({selectedDay})</div>
          <div className="overflow-x-auto">
            <div className="min-w-[960px] grid grid-cols-24 gap-2 text-xs pb-1">
              {Array.from({length:24}, (_,h)=> (
                <div key={h} className="flex flex-col items-center">
                  <div className="mb-1">{String(h).padStart(2,'0')}</div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={()=>setIntradayDelta((prev)=>{ const next=[...prev]; next[h]=(next[h]||0)-1; return next; })}>-</Button>
                    <div className="w-8 text-center">{intradayDelta[h]||0}</div>
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={()=>setIntradayDelta((prev)=>{ const next=[...prev]; next[h]=(next[h]||0)+1; return next; })}>+</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-3">These deltas are applied on top of the current Schedule coverage to simulate real-time reallocation.</div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdherenceTab({ roster, selectedDay }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 shadow-sm">
        <CardContent className="p-4">
          <div className="mb-3 font-medium">Planned vs Actual ({selectedDay}) – Adherence %</div>
          <div className="overflow-x-auto">
            <div className="min-w-[900px] grid gap-2" style={{ gridTemplateColumns: "180px 110px 110px 110px 110px 120px" }}>
              <div className="text-xs font-semibold">Agent</div>
              <div className="text-xs font-semibold">Plan start</div>
              <div className="text-xs font-semibold">Plan end</div>
              <div className="text-xs font-semibold">Actual start</div>
              <div className="text-xs font-semibold">Actual end</div>
              <div className="text-xs font-semibold">Adherence</div>
              {AGENTS.map(a=> (
                <AdherenceRow key={a.name+selectedDay+"adh"} agentName={a.name} plan={roster[a.name][selectedDay]} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TimelineRow({ block }) {
  const segments = [];
  for (let h=0; h<24; h++) {
    const hs=h*60, he=(h+1)*60;
    const work = block.active ? Math.max(0, Math.min(block.endMin, he) - Math.max(block.startMin, hs)) : 0;
    let brk = 0;
    if (block.active && (block.breakMins||0)>0 && block.breakStartMin!==undefined) {
      const bs = block.breakStartMin, be = block.breakStartMin + (block.breakMins||0);
      brk = Math.max(0, Math.min(be, he) - Math.max(bs, hs));
    }
    const net = work - brk;
    segments.push({ h, type: net>0?"work": brk>0?"break":"off"});
  }
  return (
    <div className="grid grid-cols-24 gap-px">
      {segments.map(s=> (
        <div key={s.h}
             className={`h-7 rounded-sm ${s.type==="work"?"bg-emerald-300":""} ${s.type==="break"?"bg-amber-300":""} ${s.type==="off"?"bg-gray-100":""}`}
             title={`${String(s.h).padStart(2,"0")}:00`}
        />
      ))}
    </div>
  );
}

function CoverageHeatbarSimple({ coverage }) {
  const max = Math.max(1, ...coverage);
  return (
    <div className="grid grid-cols-24 gap-1">
      {coverage.map((c, h) => (
        <div key={h} className="flex flex-col items-center">
          <div className="w-full h-10 rounded-sm" style={{ opacity: (0.2 + 0.8*c/max) }}>
            <div className="w-full h-full bg-violet-400 rounded-sm" />
          </div>
          <div className="mt-1 text-[10px] text-gray-500">{h}</div>
        </div>
      ))}
    </div>
  );
}

function TimeInput({ value, onChange, disabled }) {
  const hh = Math.floor(value/60); const mm = value%60;
  return (
    <div className="flex items-center gap-2">
      <Input type="number" className="h-9 w-14" min={0} max={23} value={hh} disabled={disabled}
             onChange={e=>{ const v = parseInt(e.target.value||"0",10); onChange(Math.max(0,Math.min(23,v))*60 + mm); }} />
      <span className="text-xs">:</span>
      <Input type="number" className="h-9 w-14" min={0} max={59} value={mm} disabled={disabled}
             onChange={e=>{ const v = parseInt(e.target.value||"0",10); onChange(hh*60 + Math.max(0,Math.min(59,v))); }} />
    </div>
  );
}

function AdherenceRow({ agentName, plan }) {
  const [actStart, setActStart] = useState(plan.startMin);
  const [actEnd, setActEnd] = useState(plan.endMin);
  const plannedMins = Math.max(0, plan.endMin - plan.startMin - (plan.breakMins||0));
  const actualMins = Math.max(0, actEnd - actStart - (plan.breakMins||0));
  const adh = plannedMins>0 ? Math.round((actualMins/plannedMins)*100) : 100;
  return (
    <>
      <div className="py-2 text-sm">{agentName}</div>
      <div><TimeInput value={plan.startMin} onChange={()=>{}} disabled /></div>
      <div><TimeInput value={plan.endMin} onChange={()=>{}} disabled /></div>
      <div><TimeInput value={actStart} onChange={setActStart} /></div>
      <div><TimeInput value={actEnd} onChange={setActEnd} /></div>
      <div className="text-sm">{adh}%</div>
    </>
  );
}
