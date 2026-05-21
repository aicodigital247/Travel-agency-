import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Flights search route
app.post("/api/flights", (req, res) => {
  const { from, to, date, cabinClass } = req.body;
  
  // Real flight simulator output
  const flights = [
    { id: "FL-102", airline: "Emirates", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60", deptime: "08:15 AM", arrtime: "02:30 PM", price: "$840", duration: "6h 15m", stops: "Non-stop" },
    { id: "FL-305", airline: "Qatar Airways", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60", deptime: "11:45 AM", arrtime: "07:15 PM", price: "$910", duration: "7h 30m", stops: "1 Stop" },
    { id: "FL-588", airline: "Turkish Airlines", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60", deptime: "04:20 PM", arrtime: "11:55 PM", price: "$720", duration: "7h 35m", stops: "Non-stop" },
    { id: "FL-912", airline: "British Airways", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60", deptime: "09:30 PM", arrtime: "05:10 AM", price: "$990", duration: "7h 40m", stops: "1 Stop" }
  ];

  setTimeout(() => {
    res.json({
      success: true,
      flights,
      searchParams: { from, to, date, cabinClass }
    });
  }, 1000); // Simulate network latency
});

// API: Hotel search route
app.post("/api/hotels", (req, res) => {
  const { destination, checkIn, checkOut, guests } = req.body;
  
  const hotels = [
    { id: "HTL-901", name: "The Grand Regent Palace", rating: "4.9", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60", price: "$280/night", location: "Downtown Center" },
    { id: "HTL-902", name: "Aura Boutique & Spa Resort", rating: "4.8", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=60", price: "$210/night", location: "Coastal Sanctuary" },
    { id: "HTL-903", name: "Horizon Heights Hotel", rating: "4.6", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60", price: "$165/night", location: "Skyline District" }
  ];

  setTimeout(() => {
    res.json({
      success: true,
      hotels,
      searchParams: { destination, checkIn, checkOut, guests }
    });
  }, 1000);
});

// API: Visa Track Simulator
app.get("/api/visa-track/:badgeNo", (req, res) => {
  const badge = req.params.badgeNo.toUpperCase();
  const visaData: Record<string, any> = {
    "V2026-N71A": { name: "Alexandra Chen", country: "United Kingdom", category: "Tier-4 Student", status: "Approved", progress: 100, updated: "2026-05-18" },
    "V2026-K48X": { name: "Daniel Martinez", country: "Canada", category: "Express Entry Worker", status: "In Progress", progress: 65, updated: "2026-05-20" },
    "V2026-P99Y": { name: "Babatunde Alao", country: "United States", category: "F1 Academic Visa", status: "Document Verification", progress: 40, updated: "2026-05-19" },
    "V2026-T15Z": { name: "Elena Rostova", country: "Germany", category: "Schengen Tourist", status: "Biometric Appointment", progress: 20, updated: "2026-05-15" }
  };

  const statusObj = visaData[badge];
  if (statusObj) {
    res.json({ success: true, data: statusObj });
  } else {
    // Generate a beautiful randomized track path for demo reasons instead of failing
    res.json({
      success: true,
      data: {
        name: "Interactive Demo Applicant",
        country: "Canada",
        category: "Tourist Sub-class 600",
        status: "Application Submitted - Pending Fee Receipt",
        progress: 15,
        updated: "Today"
      }
    });
  }
});

// API: Generic Booking Submission
app.post("/api/booking/submit", (req, res) => {
  const data = req.body;
  res.json({
    success: true,
    bookingId: "GBV-" + Math.floor(100000 + Math.random() * 900000),
    message: "Your Booking has been submitted successfully!",
    details: data
  });
});

// Serve static assets from project root
app.use(express.static(path.join(process.cwd())));

// Dynamic index routing for root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

// Start the express server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Grand Voyage Travel server running at http://localhost:${PORT}`);
});
