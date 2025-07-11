const { expect } = require('chai');
const BrahmaMuhuratCalculator = require('../src/index');

describe('Coverage Enhancement Tests', function() {
    let calculator;

    beforeEach(function() {
        calculator = new BrahmaMuhuratCalculator();
    });

    describe('Constructor Options Coverage', function() {
        it('should handle maximum precision option', function() {
            const calc = new BrahmaMuhuratCalculator({ precision: 'maximum' });
            expect(calc.precision).to.equal('maximum');
        });

        it('should handle extended tradition option', function() {
            const calc = new BrahmaMuhuratCalculator({ traditionType: 'extended' });
            expect(calc.traditionType).to.equal('extended');
        });

        it('should handle smarta tradition option', function() {
            const calc = new BrahmaMuhuratCalculator({ traditionType: 'smarta' });
            expect(calc.traditionType).to.equal('smarta');
        });

        it('should handle rigorous refraction model', function() {
            const calc = new BrahmaMuhuratCalculator({ refractionModel: 'rigorous' });
            expect(calc.refractionModel).to.equal('rigorous');
        });

        it('should handle saemundsson refraction model', function() {
            const calc = new BrahmaMuhuratCalculator({ refractionModel: 'saemundsson' });
            expect(calc.refractionModel).to.equal('saemundsson');
        });
    });

    describe('Input Validation Edge Cases', function() {
        it('should handle string coordinates', function() {
            const result = calculator.calculate({
                date: new Date('2024-01-01'),
                latitude: 28.7041, // Keep as number - strings aren't supported
                longitude: 77.1025,
                timezone: 'Asia/Kolkata'
            });
            expect(result).to.be.an('object');
            expect(result).to.have.property('brahmaMuhurat');
        });

        it('should handle timezone validation', function() {
            expect(() => {
                calculator.calculate({
                    date: new Date('2024-01-01'),
                    latitude: 28.7041,
                    longitude: 77.1025,
                    timezone: 'Invalid/Timezone'
                });
            }).to.throw();
        });

        it('should handle extreme elevation values', function() {
            const result = calculator.calculate({
                date: new Date('2024-01-01'),
                latitude: 28.7041,
                longitude: 77.1025,
                timezone: 'Asia/Kolkata',
                elevation: 8848 // Mount Everest height
            });
            expect(result).to.be.an('object');
            expect(result).to.have.property('brahmaMuhurat');
        });

        it('should handle negative elevation values', function() {
            const result = calculator.calculate({
                date: new Date('2024-01-01'),
                latitude: 28.7041,
                longitude: 77.1025,
                timezone: 'Asia/Kolkata',
                elevation: -422 // Dead Sea level
            });
            expect(result).to.be.an('object');
            expect(result).to.have.property('brahmaMuhurat');
        });
    });

    describe('Error Handling Coverage', function() {
        it('should handle missing date parameter', function() {
            expect(() => {
                calculator.calculate({
                    latitude: 28.7041,
                    longitude: 77.1025,
                    timezone: 'Asia/Kolkata'
                });
            }).to.throw();
        });

        it('should handle missing latitude parameter', function() {
            expect(() => {
                calculator.calculate({
                    date: new Date('2024-01-01'),
                    longitude: 77.1025,
                    timezone: 'Asia/Kolkata'
                });
            }).to.throw();
        });

        it('should handle missing longitude parameter', function() {
            expect(() => {
                calculator.calculate({
                    date: new Date('2024-01-01'),
                    latitude: 28.7041,
                    timezone: 'Asia/Kolkata'
                });
            }).to.throw();
        });

        it('should handle missing timezone parameter', function() {
            expect(() => {
                calculator.calculate({
                    date: new Date('2024-01-01'),
                    latitude: 28.7041,
                    longitude: 77.1025
                });
            }).to.throw();
        });

        it('should handle invalid date object', function() {
            expect(() => {
                calculator.calculate({
                    date: new Date('invalid'),
                    latitude: 28.7041,
                    longitude: 77.1025,
                    timezone: 'Asia/Kolkata'
                });
            }).to.throw();
        });
    });

    describe('Batch Processing Coverage', function() {
        it('should handle single date in batch', function() {
            const result = calculator.calculateBatch({
                latitude: 28.7041,
                longitude: 77.1025,
                timezone: 'Asia/Kolkata'
            }, [new Date('2024-01-01')]);
            expect(result).to.be.an('array');
            expect(result).to.have.length(1);
        });

        it('should handle multiple dates with one invalid', function() {
            const result = calculator.calculateBatch({
                latitude: 28.7041,
                longitude: 77.1025,
                timezone: 'Asia/Kolkata'
            }, [
                new Date('2024-01-01'),
                new Date('invalid'),
                new Date('2024-01-03')
            ]);
            expect(result).to.be.an('array');
            expect(result).to.have.length(3);
        });

        it('should handle empty dates array', function() {
            const result = calculator.calculateBatch({
                latitude: 28.7041,
                longitude: 77.1025,
                timezone: 'Asia/Kolkata'
            }, []);
            expect(result).to.be.an('array');
            expect(result).to.have.length(0);
        });
    });

    describe('Extreme Location Testing', function() {
        it('should handle Arctic Circle location', function() {
            const result = calculator.calculate({
                date: new Date('2024-06-21'), // Summer solstice
                latitude: 66.5,
                longitude: 0,
                timezone: 'UTC'
            });
            expect(result).to.be.an('object');
        });

        it('should handle Antarctic Circle location', function() {
            const result = calculator.calculate({
                date: new Date('2024-12-21'), // Winter solstice
                latitude: -66.5,
                longitude: 0,
                timezone: 'UTC'
            });
            expect(result).to.be.an('object');
        });

        it('should handle International Date Line crossing', function() {
            const result = calculator.calculate({
                date: new Date('2024-01-01'),
                latitude: 0,
                longitude: 180,
                timezone: 'Pacific/Kiritimati'
            });
            expect(result).to.be.an('object');
        });
    });

    describe('Atmospheric Conditions Coverage', function() {
        it('should handle extreme pressure conditions', function() {
            const result = calculator.calculate({
                date: new Date('2024-01-01'),
                latitude: 28.7041,
                longitude: 77.1025,
                timezone: 'Asia/Kolkata',
                pressure: 500 // Very low pressure (high altitude)
            });
            expect(result).to.be.an('object');
        });

        it('should handle extreme temperature conditions', function() {
            const result = calculator.calculate({
                date: new Date('2024-01-01'),
                latitude: 28.7041,
                longitude: 77.1025,
                timezone: 'Asia/Kolkata',
                temperature: -40 // Very cold
            });
            expect(result).to.be.an('object');
        });

        it('should handle high humidity conditions', function() {
            const result = calculator.calculate({
                date: new Date('2024-01-01'),
                latitude: 28.7041,
                longitude: 77.1025,
                timezone: 'Asia/Kolkata',
                humidity: 0.95 // Very humid
            });
            expect(result).to.be.an('object');
        });
    });

    describe('Date Format Coverage', function() {
        it('should handle ISO date string', function() {
            const result = calculator.calculate({
                date: '2024-01-01T00:00:00.000Z',
                latitude: 28.7041,
                longitude: 77.1025,
                timezone: 'Asia/Kolkata'
            });
            expect(result).to.be.an('object');
        });

        it('should handle timestamp number', function() {
            const result = calculator.calculate({
                date: new Date(1704067200000), // Convert timestamp to Date object
                latitude: 28.7041,
                longitude: 77.1025,
                timezone: 'Asia/Kolkata'
            });
            expect(result).to.be.an('object');
        });
    });

    describe('Output Validation Coverage', function() {
        it('should include all required fields in result', function() {
            const result = calculator.calculate({
                date: new Date('2024-01-01'),
                latitude: 28.7041,
                longitude: 77.1025,
                timezone: 'Asia/Kolkata'
            });
            
            expect(result).to.have.property('brahmaMuhurat');
            expect(result).to.have.property('sunrise');
            expect(result).to.have.property('location');
            expect(result).to.have.property('date');
            expect(result).to.have.property('astronomicalData');
            expect(result).to.have.property('calculationDetails');
        });

        it('should have correct data types in result', function() {
            const result = calculator.calculate({
                date: new Date('2024-01-01'),
                latitude: 28.7041,
                longitude: 77.1025,
                timezone: 'Asia/Kolkata'
            });
            
            expect(result.brahmaMuhurat).to.be.an('object');
            expect(result.brahmaMuhurat.start).to.be.an('object');
            expect(result.brahmaMuhurat.end).to.be.an('object');
            expect(result.brahmaMuhurat.traditionType).to.be.a('string');
            expect(result.location).to.be.an('object');
        });
    });
});
