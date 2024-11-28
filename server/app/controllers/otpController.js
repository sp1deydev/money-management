const express = require('express');
const speakeasy = require('speakeasy');
const OTP = require('../models/otp');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const exprire_time = 60000

function generateOTP() {
    const otp = speakeasy.totp({
        secret: 'secret_key',  // Use a secure key in production
        encoding: 'base32',
    });
    return otp;
}
async function sendOTPEmail(email, otp, username) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',  // Adjust this according to your email service
        auth: {
            user: process.env.OTP_SERVER_EMAIL_HOST,
            pass: process.env.OTP_SERVER_EMAIL_PASS
        }
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                padding: 16px;
                background-color: #f4f4f4;
                max-width: 600px;
                margin: auto;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                color: #000;
            }
            .otp {
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                background-color: #ffffff;
                color: #0066cc; /* Adjust this to your main color */
                margin: 24px 0;
                border-radius: 12px;
            }
            .message {
                color: #333;
            }
            .footer {
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>OTP Verification Code</h1>
            </div>
            <p class="message">Hello, <b><i>${username}</i></b></p>
            <p class="message">Please use the following One-Time Password (OTP) to complete your action. For security reasons, do not share this code with anyone.</p>
            <div class="otp">${otp}</div>
            <p class="message">This OTP is valid for the next ${exprire_time/1000} seconds.</p>
            <div class="footer">
                <p>Thank you,<br>Thien Tran</p>
            </div>
        </div>
    </body>
    </html>
`;
    
    await transporter.sendMail({
        from: '"OTP Service" emthienmatma@gmail.com',
        to: email,
        subject: 'OTP Verification Code',
        html: htmlContent,
    });
}

const otpController = {
    
    generateEmailOTP: async (req, res) => {
        const { email, username } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required', message:"error" });
        }
        
        const otp = generateOTP();
        OTP.findOne({email: email})
            .then(async (result) => {
                if (result) {
                    try {
                        await sendOTPEmail(email, otp, username);
                        OTP.deleteOne({_id: result._id}).then().catch(err => res.status(500).json(err))
                        const salt = bcrypt.genSaltSync(10);
                        const otpRecord = new OTP({email: email, otp: bcrypt.hashSync(otp, salt)});
                        otpRecord.save() 
                            .then(result => {
                                res.status(200).json({ message: 'OTP sent to your email', expires: exprire_time, success: true });
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({message: 'Failed to send OTP email or save OTP to database, success: false'})
                            }
                            )
                        
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ message: 'Failed to send OTP email',  success: false });
                    }
                }
                else {
                    try {
                        await sendOTPEmail(email, otp, username);
                        const salt = bcrypt.genSaltSync(10);
                        const otpRecord = new OTP({email: email, otp: bcrypt.hashSync(otp, salt)});
                        otpRecord.save() 
                            .then(result => {
                                res.status(200).json({ message: 'OTP sent to your email', expires: exprire_time, success: true });
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({message: 'Failed to send OTP email or save OTP to database, success: false'})
                            }
                            )
                        
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ message: 'Failed to send OTP email',  success: false });
                    }
                }
            })
            .catch(err => console.error(err))
        
    },
    verifyEmailOTP: (req, res) => {
        const { otp, email } = req.body;
        OTP.findOne({email: email})
        .then(result => {
            if (result) {
                const isValidOTP = bcrypt.compareSync(otp, result.otp)
                console.log(result)
                console.log(isValidOTP)
                if (isValidOTP) {
                    res.status(200).json({ message: 'Verify OTP succesfully', success: true });
                }
                else {
                    res.status(400).json({ message: 'Failed to verify OTP. Please input valid OTP',  success: false });
                }
                }
            else {
                res.status(400).json({ message: 'Failed to verify OTP. Please input valid OTP',  success: false });
            }
        })
        .catch(err => res.status(500).json({ message: 'Internal Server Error ',  success: false }))
    }

}

module.exports = otpController;