const { expect } = require('chai');
const { validateCoordinates, validateTimezone, validateElevation, convertCoordinateFormats } = require('../src/utils/geo');
const { parseDateInput, formatDateTime, formatTime, formatDate, convertTimezone, getTimezoneOffset } = require('../src/utils/time');

describe('Utility Functions Coverage', function() {
    describe('Geographic Utility Functions', function() {
        it('should validate valid coordinates', function() {
            expect(() => validateCoordinates(28.7041, 77.1025)).to.not.throw();
        });

        it('should reject invalid latitude', function() {
            expect(() => validateCoordinates(91, 77.1025)).to.throw();
            expect(() => validateCoordinates(-91, 77.1025)).to.throw();
        });

        it('should reject invalid longitude', function() {
            expect(() => validateCoordinates(28.7041, 181)).to.throw();
            expect(() => validateCoordinates(28.7041, -181)).to.throw();
        });

        it('should reject non-numeric coordinates', function() {
            expect(() => validateCoordinates('invalid', 77.1025)).to.throw();
            expect(() => validateCoordinates(28.7041, 'invalid')).to.throw();
        });

        it('should reject NaN coordinates', function() {
            expect(() => validateCoordinates(NaN, 77.1025)).to.throw();
            expect(() => validateCoordinates(28.7041, NaN)).to.throw();
        });

        it('should validate valid timezone', function() {
            expect(() => validateTimezone('Asia/Kolkata')).to.not.throw();
            expect(() => validateTimezone('UTC')).to.not.throw();
            expect(() => validateTimezone('America/New_York')).to.not.throw();
        });

        it('should reject invalid timezone', function() {
            expect(() => validateTimezone('Invalid/Timezone')).to.throw();
            expect(() => validateTimezone('')).to.throw();
            expect(() => validateTimezone(null)).to.throw();
        });

        it('should validate valid elevation', function() {
            expect(() => validateElevation(0)).to.not.throw();
            expect(() => validateElevation(1000)).to.not.throw();
            expect(() => validateElevation(-100)).to.not.throw();
        });

        it('should reject invalid elevation', function() {
            expect(() => validateElevation(10000)).to.throw();
            expect(() => validateElevation(-600)).to.throw();
            expect(() => validateElevation('invalid')).to.throw();
            expect(() => validateElevation(NaN)).to.throw();
        });

        it('should convert coordinate formats', function() {
            const result = convertCoordinateFormats(28.7041, 77.1025);
            expect(result).to.be.an('object');
            expect(result).to.have.property('decimal');
            expect(result).to.have.property('dms');
            expect(result).to.have.property('dm');
            expect(result).to.have.property('formatted');
        });
    });

    describe('Time Utility Functions', function() {
        it('should parse Date objects', function() {
            const input = new Date('2024-01-01');
            const result = parseDateInput(input);
            expect(result).to.be.a('date');
            expect(result.getTime()).to.equal(input.getTime());
        });

        it('should parse ISO date strings', function() {
            const result = parseDateInput('2024-01-01');
            expect(result).to.be.a('date');
            expect(result.getFullYear()).to.equal(2024);
            expect(result.getMonth()).to.equal(0);
            expect(result.getDate()).to.equal(1);
        });

        it('should parse various date formats', function() {
            const formats = [
                '2024-01-01',
                '2024-01-01 12:00:00',
                '01/01/2024',
                '01-01-2024',
                '2024/01/01'
            ];

            formats.forEach(format => {
                const result = parseDateInput(format);
                expect(result).to.be.a('date');
            });
        });

        it('should reject invalid date strings', function() {
            expect(() => parseDateInput('invalid-date')).to.throw();
            expect(() => parseDateInput('2024-13-01')).to.throw();
            expect(() => parseDateInput('2024-01-32')).to.throw();
        });

        it('should format date time', function() {
            const date = new Date('2024-01-01T12:00:00Z');
            const result = formatDateTime(date, 'Asia/Kolkata');
            expect(result).to.be.a('string');
            expect(result).to.include('2024');
        });

        it('should format time only', function() {
            const date = new Date('2024-01-01T12:00:00Z');
            const result = formatTime(date, 'Asia/Kolkata');
            expect(result).to.be.a('string');
            expect(result).to.match(/^\d{2}:\d{2}:\d{2}$/);
        });

        it('should format date only', function() {
            const date = new Date('2024-01-01T12:00:00Z');
            const result = formatDate(date, 'Asia/Kolkata');
            expect(result).to.be.a('string');
            expect(result).to.match(/^\d{4}-\d{2}-\d{2}$/);
        });

        it('should convert between timezones', function() {
            const date = new Date('2024-01-01T12:00:00Z');
            const result = convertTimezone(date, 'UTC', 'Asia/Kolkata');
            expect(result).to.be.a('date');
        });

        it('should get timezone offset', function() {
            const offset = getTimezoneOffset('Asia/Kolkata');
            expect(offset).to.be.a('number');
            expect(offset).to.equal(330); // +5:30 in minutes
        });

        it('should handle timezone offset for different dates', function() {
            const winterDate = new Date('2024-01-01');
            const summerDate = new Date('2024-07-01');
            
            const winterOffset = getTimezoneOffset('America/New_York', winterDate);
            const summerOffset = getTimezoneOffset('America/New_York', summerDate);
            
            expect(winterOffset).to.be.a('number');
            expect(summerOffset).to.be.a('number');
            // Should be different due to daylight saving time
        });
    });

    describe('Edge Case Coverage', function() {
        it('should handle leap year dates', function() {
            const result = parseDateInput('2024-02-29'); // Leap year
            expect(result).to.be.a('date');
            expect(result.getMonth()).to.equal(1);
            expect(result.getDate()).to.equal(29);
        });

        it('should handle coordinate edge cases', function() {
            // Test exact boundary values
            expect(() => validateCoordinates(90, 180)).to.not.throw();
            expect(() => validateCoordinates(-90, -180)).to.not.throw();
            expect(() => validateCoordinates(0, 0)).to.not.throw();
        });

        it('should handle timezone edge cases', function() {
            // Test various timezone formats
            expect(() => validateTimezone('GMT')).to.not.throw();
            expect(() => validateTimezone('Europe/London')).to.not.throw();
            expect(() => validateTimezone('Pacific/Honolulu')).to.not.throw();
        });

        it('should handle elevation edge cases', function() {
            // Test boundary values
            expect(() => validateElevation(-500)).to.not.throw(); // Dead Sea level
            expect(() => validateElevation(9000)).to.not.throw(); // High mountain
            expect(() => validateElevation(0)).to.not.throw(); // Sea level
        });
    });
});
