import { useEffect, useState, useRef } from "react";

type Threat = {
  id: number;
  name: string;
  source: string;
  severity: "critical" | "high" | "medium" | "low";
  time: string;
};

const INITIAL_THREATS: Threat[] = [
  { id: 1, name: "Anomalous login pattern detected", source: "auth-service.prod", severity: "critical", time: "2s ago" },
  { id: 2, name: "Unusual outbound traffic to unknown IP", source: "egress-monitor", severity: "high", time: "14s ago" },
  { id: 3, name: "Privilege escalation attempt blocked", source: "iam-layer", severity: "high", time: "38s ago" },
  { id: 4, name: "Credential stuffing signature matched", source: "edge-gateway", severity: "medium", time: "1m ago" },
  { id: 5, name: "API rate limit threshold exceeded", source: "api-throttle", severity: "medium", time: "2m ago" },
  { id: 6, name: "Certificate renewal approaching", source: "tls-manager", severity: "low", time: "4m ago" },
  { id: 7, name: "Port scan from external range", source: "network-sentinel", severity: "high", time: "6m ago" },
  { id: 8, name: "Malware signature hash matched", source: "file-integrity", severity: "critical", time: "9m ago" },
];

const THREAT_POOL = [
  { name: "SQL injection pattern detected", source: "waf-layer", severity: "critical" as const },
  { name: "DDoS traffic spike — mitigated", source: "edge-gateway", severity: "high" as const },
  { name: "Suspicious DNS query blocked", source: "dns-sentinel", severity: "medium" as const },
  { name: "Unauthorized config change reverted", source: "config-guard", severity: "high" as const },
  { name: "Botnet C2 beacon signature", source: "traffic-analyzer", severity: "critical" as const },
  { name: "Failed MFA brute-force attempt", source: "auth-service.prod", severity: "medium" as const },
  { name: "Cryptominer process detected", source: "runtime-sentinel", severity: "critical" as const },
  { name: "Anomalous data exfil pattern", source: "dlp-monitor", severity: "high" as const },
];

function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let frame: number;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

function Radar() {
  const rings = [0.25, 0.5, 0.75, 1];
  const dots = [
    { top: "22%", left: "68%", delay: "0s", accent: false },
    { top: "70%", left: "30%", delay: "1s", accent: false },
    { top: "45%", left: "82%", delay: "2s", accent: true },
    { top: "60%", left: "65%", delay: "0.5s", accent: false },
    { top: "35%", left: "38%", delay: "1.5s", accent: true },
    { top: "80%", left: "55%", delay: "2.5s", accent: false },
  ];
  return (
    <div className="radar-container">
      {rings.map((r, i) => (
        <div
          key={i}
          className="radar-ring"
          style={{ width: `${r * 100}%`, height: `${r * 100}%` }}
        />
      ))}
      <div className="radar-cross" />
      <div className="radar-cross vertical" />
      <div className="radar-sweep" />
      {dots.map((d, i) => (
        <div
          key={i}
          className={`radar-dot ${d.accent ? "accent" : ""}`}
          style={{ top: d.top, left: d.left, animationDelay: d.delay }}
        />
      ))}
    </div>
  );
}

function ThreatFeed() {
  const [threats, setThreats] = useState<Threat[]>(INITIAL_THREATS);
  const nextId = useRef(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const pool = THREAT_POOL[Math.floor(Math.random() * THREAT_POOL.length)];
      const newThreat: Threat = {
        id: nextId.current++,
        name: pool.name,
        source: pool.source,
        severity: pool.severity,
        time: "just now",
      };
      setThreats((prev) => [newThreat, ...prev].slice(0, 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="threat-feed">
      <div className="threat-feed-header">
        <span className="threat-feed-title">LIVE THREAT FEED</span>
        <span className="threat-feed-status">● MONITORING</span>
      </div>
      <div className="threat-list">
        {threats.map((t) => (
          <div key={t.id} className="threat-item">
            <div className={`threat-severity ${t.severity}`} />
            <div className="threat-info">
              <div className="threat-name">{t.name}</div>
              <div className="threat-meta">{t.source}</div>
            </div>
            <div className="threat-time">{t.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemMonitor() {
  const [metrics, setMetrics] = useState({
    cpu: 34,
    mem: 58,
    net: 72,
    threats: 12,
  });
  const [waveform, setWaveform] = useState<number[]>(
    Array.from({ length: 32 }, () => Math.random() * 100)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: 25 + Math.floor(Math.random() * 45),
        mem: 45 + Math.floor(Math.random() * 35),
        net: 50 + Math.floor(Math.random() * 45),
        threats: 8 + Math.floor(Math.random() * 20),
      });
      setWaveform(Array.from({ length: 32 }, () => 20 + Math.random() * 80));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sys-monitor">
      <div className="sys-monitor-header">
        <span className="sys-monitor-title">SYSTEM TELEMETRY</span>
        <span className="threat-feed-status">● ONLINE</span>
      </div>
      <div className="sys-monitor-grid">
        <div className="sys-metric">
          <div className="sys-metric-label">CPU Load</div>
          <div className="sys-metric-value">{metrics.cpu}%</div>
          <div className="sys-bar">
            <div className="sys-bar-fill primary" style={{ width: `${metrics.cpu}%` }} />
          </div>
        </div>
        <div className="sys-metric">
          <div className="sys-metric-label">Memory</div>
          <div className="sys-metric-value">{metrics.mem}%</div>
          <div className="sys-bar">
            <div className="sys-bar-fill accent" style={{ width: `${metrics.mem}%` }} />
          </div>
        </div>
        <div className="sys-metric">
          <div className="sys-metric-label">Network I/O</div>
          <div className="sys-metric-value">{metrics.net}%</div>
          <div className="sys-bar">
            <div className="sys-bar-fill warning" style={{ width: `${metrics.net}%` }} />
          </div>
        </div>
        <div className="sys-metric">
          <div className="sys-metric-label">Active Threats</div>
          <div className="sys-metric-value">{metrics.threats}</div>
          <div className="sys-bar">
            <div className="sys-bar-fill danger" style={{ width: `${(metrics.threats / 28) * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="sys-waveform">
        {waveform.map((h, i) => (
          <div
            key={i}
            className="sys-wave-bar"
            style={{ height: `${h}%`, opacity: 0.3 + (h / 100) * 0.7 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const threatsBlocked = useAnimatedNumber(2847391);
  const avgResponse = useAnimatedNumber(47);
  const uptime = useAnimatedNumber(99.99);
  const coverage = useAnimatedNumber(360);

  return (
    <>
      <div className="grid-bg" />
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-mark" />
          SENTINEL<span style={{ color: "var(--primary)" }}>-AI</span>
        </div>
        <ul className="nav-links">
          <li><a href="#features">Capabilities</a></li>
          <li><a href="#dashboard">Live Dashboard</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#docs">Docs</a></li>
        </ul>
        <button className="nav-cta">Request Access</button>
      </nav>

      <section className="hero">
        <Radar />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AUTONOMOUS THREAT INTELLIGENCE
          </div>
          <h1>
            Security that thinks
            <br />
            <span className="gradient-text">before threats move.</span>
          </h1>
          <p>
            Sentinel-AI continuously monitors your infrastructure, detects
            anomalies in real time, and autonomously neutralizes threats —
            before they become incidents.
          </p>
          <div className="hero-actions">
            <a href="#dashboard" className="btn-primary">View Live Dashboard</a>
            <a href="#features" className="btn-secondary">Explore Capabilities</a>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        <div className="stat">
          <div className="stat-value">{Math.floor(threatsBlocked).toLocaleString()}</div>
          <div className="stat-label">Threats Neutralized</div>
        </div>
        <div className="stat">
          <div className="stat-value">{avgResponse.toFixed(0)}ms</div>
          <div className="stat-label">Avg Response Time</div>
        </div>
        <div className="stat">
          <div className="stat-value">{uptime.toFixed(2)}%</div>
          <div className="stat-label">System Uptime</div>
        </div>
        <div className="stat">
          <div className="stat-value">{coverage.toFixed(0)}°</div>
          <div className="stat-label">Full-Spectrum Coverage</div>
        </div>
      </div>

      <section className="section" id="features">
        <div className="section-header">
          <div className="section-tag">// CAPABILITIES</div>
          <h2 className="section-title">Built to see what humans miss</h2>
          <p className="section-subtitle">
            Four autonomous layers working in concert — detection, analysis,
            response, and recovery.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">◉</div>
            <h3>Behavioral Detection</h3>
            <p>
              Learns the normal rhythm of your infrastructure and flags
              deviations in real time — zero signatures required.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⬡</div>
            <h3>Autonomous Response</h3>
            <p>
              Isolates compromised assets, revokes credentials, and applies
              containment in milliseconds — no human in the loop.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">◈</div>
            <h3>Threat Intelligence</h3>
            <p>
              Correlates events across your stack with global threat feeds to
              surface coordinated attacks before they spread.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">▲</div>
            <h3>Attack Surface Mapping</h3>
            <p>
              Continuously discovers and maps every exposed asset, port, and
              credential — so nothing hides in the dark.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">◆</div>
            <h3>Deception Technology</h3>
            <p>
              Deploys dynamic honeypots that lure attackers into controlled
              traps, capturing full attack blueprints.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">◐</div>
            <h3>Post-Incident Recovery</h3>
            <p>
              Automatically rolls back affected systems to a known-good state
              and generates a full forensic timeline.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="dashboard">
        <div className="section-header">
          <div className="section-tag">// LIVE TELEMETRY</div>
          <h2 className="section-title">Your security operations, in real time</h2>
          <p className="section-subtitle">
            A live view of what Sentinel-AI sees right now — this feed updates
            as you watch.
          </p>
        </div>
        <div className="dashboard">
          <ThreatFeed />
          <SystemMonitor />
        </div>
      </section>

      <section className="cta" id="pricing">
        <div className="cta-box">
          <h2>Deploy Sentinel-AI in under 10 minutes</h2>
          <p>
            Connect your infrastructure and watch the radar light up. No agents
            to install, no signatures to maintain.
          </p>
          <div className="cta-actions">
            <a href="#" className="btn-primary">Request Access</a>
            <a href="#docs" className="btn-secondary">Read the Docs</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-text">SENTINEL-AI // AUTONOMOUS THREAT INTELLIGENCE // 2026</div>
      </footer>
    </>
  );
}
