const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? (process.env.ALLOWED_ORIGINS || '').split(',')
        : ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:8000'],
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock database for MVP (replace with real database later)
const mockEvents = [
    {
        id: '1',
        pdufaDate: '2025-01-15T00:00:00Z',
        drugName: 'Keytruda',
        indication: 'Triple-Negative Breast Cancer',
        eventType: 'PDUFA',
        status: 'PENDING',
        riskLevel: 'LOW',
        priorityReview: true,
        company: { ticker: 'MRK', name: 'Merck & Co.', marketCapCategory: 'LARGE' }
    },
    {
        id: '2',
        pdufaDate: '2025-01-22T00:00:00Z',
        drugName: 'Livmarli',
        indication: 'Alagille Syndrome',
        eventType: 'ADCOM',
        status: 'PENDING',
        riskLevel: 'MEDIUM',
        priorityReview: false,
        company: { ticker: 'ALNY', name: 'Alnylam Pharmaceuticals', marketCapCategory: 'LARGE' }
    },
    {
        id: '3',
        pdufaDate: '2025-01-28T00:00:00Z',
        drugName: 'Sunlenca',
        indication: 'HIV Treatment',
        eventType: 'PDUFA',
        status: 'PENDING',
        riskLevel: 'LOW',
        priorityReview: true,
        company: { ticker: 'GILD', name: 'Gilead Sciences', marketCapCategory: 'LARGE' }
    },
    {
        id: '4',
        pdufaDate: '2025-02-05T00:00:00Z',
        drugName: 'TECVAYLI',
        indication: 'Multiple Myeloma',
        eventType: 'PDUFA',
        status: 'PENDING',
        riskLevel: 'LOW',
        priorityReview: false,
        company: { ticker: 'JNJ', name: 'Johnson & Johnson', marketCapCategory: 'LARGE' }
    },
    {
        id: '5',
        pdufaDate: '2025-02-12T00:00:00Z',
        drugName: 'Roctavian',
        indication: 'Hemophilia A',
        eventType: 'ADCOM',
        status: 'PENDING',
        riskLevel: 'HIGH',
        priorityReview: false,
        company: { ticker: 'BMRN', name: 'BioMarin Pharmaceutical', marketCapCategory: 'SMALL' }
    },
    {
        id: '6',
        pdufaDate: '2025-02-18T00:00:00Z',
        drugName: 'Truseltiq',
        indication: 'Solid Tumors',
        eventType: 'PDUFA',
        status: 'PENDING',
        riskLevel: 'HIGH',
        priorityReview: false,
        company: { ticker: 'EXEL', name: 'Exelixis Inc', marketCapCategory: 'SMALL' }
    },
    {
        id: '7',
        pdufaDate: '2025-03-08T00:00:00Z',
        drugName: 'Epcoritamab',
        indication: 'DLBCL',
        eventType: 'PDUFA',
        status: 'PENDING',
        riskLevel: 'MEDIUM',
        priorityReview: true,
        company: { ticker: 'ABBV', name: 'AbbVie Inc', marketCapCategory: 'LARGE' }
    },
    {
        id: '8',
        pdufaDate: '2025-03-25T00:00:00Z',
        drugName: 'Lumakras',
        indication: 'KRAS G12C Lung Cancer',
        eventType: 'PDUFA',
        status: 'PENDING',
        riskLevel: 'MEDIUM',
        priorityReview: false,
        company: { ticker: 'AMGN', name: 'Amgen Inc', marketCapCategory: 'LARGE' }
    }
];

// Serve the main frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

// Get PDUFA events with filtering
app.get('/api/pdufa/events', (req, res) => {
    try {
        const {
            marketCap,
            eventType,
            riskLevel,
            search,
            startDate,
            endDate,
            limit = 100,
            offset = 0
        } = req.query;

        let filteredEvents = [...mockEvents];

        // Date filtering
        if (startDate) {
            filteredEvents = filteredEvents.filter(event => 
                new Date(event.pdufaDate) >= new Date(startDate)
            );
        }
        if (endDate) {
            filteredEvents = filteredEvents.filter(event => 
                new Date(event.pdufaDate) <= new Date(endDate)
            );
        }

        // Market cap filtering
        if (marketCap && marketCap !== 'all') {
            filteredEvents = filteredEvents.filter(event => 
                event.company.marketCapCategory === marketCap.toUpperCase()
            );
        }

        // Event type filtering
        if (eventType && eventType !== 'all') {
            filteredEvents = filteredEvents.filter(event => 
                event.eventType === eventType.toUpperCase()
            );
        }

        // Risk level filtering
        if (riskLevel && riskLevel !== 'all') {
            filteredEvents = filteredEvents.filter(event => 
                event.riskLevel === riskLevel.toUpperCase()
            );
        }

        // Search filtering
        if (search) {
            const searchTerm = search.toLowerCase();
            filteredEvents = filteredEvents.filter(event => 
                event.company.ticker.toLowerCase().includes(searchTerm) ||
                event.company.name.toLowerCase().includes(searchTerm) ||
                event.drugName.toLowerCase().includes(searchTerm) ||
                event.indication.toLowerCase().includes(searchTerm)
            );
        }

        // Pagination
        const total = filteredEvents.length;
        const startIndex = parseInt(offset);
        const endIndex = startIndex + parseInt(limit);
        const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

        res.json({
            success: true,
            data: paginatedEvents,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: endIndex < total
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching PDUFA events:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

// Get upcoming events (next 30 days)
app.get('/api/pdufa/upcoming', (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const now = new Date();
        const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        const upcomingEvents = mockEvents.filter(event => {
            const eventDate = new Date(event.pdufaDate);
            return eventDate >= now && eventDate <= futureDate && event.status === 'PENDING';
        }).sort((a, b) => new Date(a.pdufaDate) - new Date(b.pdufaDate));

        res.json({
            success: true,
            data: upcomingEvents,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

// Get specific PDUFA event by ID
app.get('/api/pdufa/events/:id', (req, res) => {
    try {
        const event = mockEvents.find(e => e.id === req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'PDUFA event not found',
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            data: event,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching PDUFA event:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

// Simulate FDA data sync (placeholder for real OpenFDA integration)
app.post('/api/sync/openfda', (req, res) => {
    try {
        // Simulate sync process
        const result = {
            eventsProcessed: mockEvents.length,
            newEvents: 0,
            updatedEvents: 0,
            errors: 0,
            lastSync: new Date().toISOString()
        };

        res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Sync simulation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Sync failed',
            timestamp: new Date().toISOString()
        });
    }
});

// Get sync status
app.get('/api/sync/status', (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                lastSync: new Date().toISOString(),
                totalEvents: mockEvents.length,
                totalCompanies: [...new Set(mockEvents.map(e => e.company.ticker))].length,
                status: 'active'
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error getting sync status:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

// Get all companies
app.get('/api/companies', (req, res) => {
    try {
        const companies = [...new Map(
            mockEvents.map(event => [event.company.ticker, event.company])
        ).values()];

        res.json({
            success: true,
            data: companies,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 PDUFA Tracker API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`📅 API Docs: http://localhost:${PORT}/api/pdufa/events`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
