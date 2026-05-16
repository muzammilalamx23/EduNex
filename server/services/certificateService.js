const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const stream = require('stream');
const User = require('../models/User');
const Course = require('../models/Course');
const logger = require('../utils/logger');

// Configure cloudinary (assumes process.env has CLOUDINARY_URL or CLOUDINARY_API_KEY etc)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class CertificateService {
    /**
     * Generate and upload a certificate to Cloudinary, then save to user profile
     */
    async generateCertificate(userId, courseId) {
        try {
            const user = await User.findById(userId);
            const course = await Course.findById(courseId);

            if (!user || !course) {
                throw new Error('User or Course not found');
            }

            // Check if certificate already exists
            const enrolledIndex = user.enrolledCourses.findIndex(c => c.courseId.toString() === courseId.toString());
            if (enrolledIndex !== -1 && user.enrolledCourses[enrolledIndex].certificateUrl) {
                return {
                    certificateId: user.enrolledCourses[enrolledIndex].certificateId,
                    certificateUrl: user.enrolledCourses[enrolledIndex].certificateUrl
                };
            }

            const certId = `EDUNEX-${uuidv4().split('-')[0].toUpperCase()}-${new Date().getFullYear()}`;
            const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            // Generate PDF in memory
            const pdfBuffer = await this._createPdfBuffer(user.fullName, course.title, certId, issueDate);

            // Upload buffer to Cloudinary
            const cloudinaryUrl = await this._uploadToCloudinary(pdfBuffer, certId);

            // Save to DB
            if (enrolledIndex !== -1) {
                user.enrolledCourses[enrolledIndex].certificateId = certId;
                user.enrolledCourses[enrolledIndex].certificateUrl = cloudinaryUrl;
                user.enrolledCourses[enrolledIndex].issuedAt = new Date();
                await user.save();
            }

            return { certificateId: certId, certificateUrl: cloudinaryUrl };

        } catch (error) {
            logger.error('[CertificateService] Generation Failed:', error);
            throw error;
        }
    }

    _createPdfBuffer(studentName, courseName, certId, issueDate) {
        return new Promise((resolve, reject) => {
            try {
                // Landscape A4
                const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
                const buffers = [];
                
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => resolve(Buffer.concat(buffers)));
                doc.on('error', reject);

                // Background
                doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f111a');

                // Inner Border
                doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
                   .lineWidth(4)
                   .stroke('#8b5cf6'); // Violet border

                // Header
                doc.fontSize(40).fillColor('#ffffff').text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });
                
                // Content
                doc.fontSize(20).fillColor('#9ca3af').text('This is to certify that', 0, 180, { align: 'center' });
                doc.fontSize(36).fillColor('#14b8a6').text(studentName, 0, 230, { align: 'center' }); // Teal name
                
                doc.fontSize(20).fillColor('#9ca3af').text('has successfully completed the course', 0, 290, { align: 'center' });
                doc.fontSize(30).fillColor('#ffffff').text(courseName, 0, 340, { align: 'center' });
                
                // Footer
                doc.fontSize(14).fillColor('#6b7280').text(`Date: ${issueDate}`, 100, 450);
                doc.fontSize(14).fillColor('#6b7280').text(`Certificate ID: ${certId}`, doc.page.width - 350, 450, { align: 'right' });

                // Brand
                doc.fontSize(24).fillColor('#8b5cf6').text('EduNex Platform', 0, 480, { align: 'center' });

                doc.end();
            } catch (err) {
                reject(err);
            }
        });
    }

    _uploadToCloudinary(buffer, certId) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'edunex_certificates',
                    public_id: certId,
                    resource_type: 'raw', // Treat PDF as raw file
                    format: 'pdf'
                },
                (error, result) => {
                    if (error) {
                        console.error("☁️ Cloudinary Raw Error:", error);
                        return reject(new Error(error.message || JSON.stringify(error)));
                    }
                    resolve(result.secure_url);
                }
            );
            
            const bufferStream = new stream.PassThrough();
            bufferStream.end(buffer);
            bufferStream.pipe(uploadStream);
        });
    }
}

module.exports = new CertificateService();
