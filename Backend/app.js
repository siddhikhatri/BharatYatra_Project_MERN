require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose') //mongodb connection
const fileupload = require('express-fileupload') //express fileupload
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express()
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

var cors = require('cors')
const UserData = require('./models/UserData')
const PackageData = require('./models/PackageData')
const EnquiryData = require('./models/EnquiryData')
const PackageEnquiry = require('./models/PackageEnquiry')
const BookingData = require('./models/BookingData')
const AdminData = require('./models/AdminData')
const ReviewData = require("./models/ReviewData");
// const WishlistData = require('./models/WishlistData');

app.use(express.static('public')) //used for images 
app.use(express.json()) //used for 
app.use(express.urlencoded({ extended: true }))    //used for post method
app.use(cors())
app.use(fileupload())//used for fileupload

//to use ejs files
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connection Established."))
  .catch((err) => console.log("Erron in Connection"))


const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};


app.get('/', (req, res) => {
  res.send("Welcome !")
})

//admin dashboard page States
app.get('/admin/dashboard_stats', async (req, res) => {
  try {
    //Count 
    const totalPackages = await PackageData.countDocuments();
    const totalUsers = await UserData.countDocuments();
    const totalBookings = await BookingData.countDocuments();
    const totalEnquiries = await EnquiryData.countDocuments();

    res.json({ totalPackages, totalUsers, totalBookings, totalEnquiries });
  }
  catch (error) {
    console.log("Error In Fetching Data", error);
    res.status(500).json({
      message: "Server Error"
    });
  }
});

//admin Signup
app.post("/admin/signup", async (req, res) => {

  const { name, email, password, phone } = req.body;

  // HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new AdminData({
    name,
    email,
    password: hashedPassword,
    phone
  });

  await admin.save();

  res.json({ message: "Admin Created" });
});

//admin login
app.post("/admin/login", async (req, res) => {

  const { email, password } = req.body;

  const admin = await AdminData.findOne({ email });

  if (!admin) {
    return res.json({ message: "Invalid Credentials" });
  }

  //  COMPARE PASSWORD
  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.json({ message: "Invalid Credentials" });
  }

  res.json({
    message: "Login Successful",
    admin
  });
});

//admin change password
app.post("/admin/changePassword", async (req, res) => {

  try {

    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.json({ message: "All Fields are Required" });
    }

    const admin = await AdminData.findOne({ email });

    if (!admin) {
      return res.json({ message: "Admin not Found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);

    if (!isMatch) {
      return res.json({ message: "Current Password is Incorrect" });
    }

    //  HASH NEW PASSWORD
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedNewPassword;

    await admin.save();

    admin.password = newPassword;

    await admin.save();

    res.json({ message: "Password Updated Successfully" });

  } catch (error) {

    console.log(error);
    res.json({ message: "Server Error" });

  }

});

//admin forgotpassword
app.post("/admin/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await AdminData.findOne({ email });

    if (!admin) {
      return res.json({ message: "Admin not found" });
    }

    //  Generate temp password
    const tempPassword = Math.random().toString(36).slice(-8);

    //  Hash it
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    admin.password = hashedPassword;
    await admin.save();

    // Send temp password via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Bharat Yatra" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Password Reset",
      text: `Your New Temporary Password is: ${tempPassword}`
    });

    res.json({ message: "Temporary Password Sent to Email" });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});




//user contact us mail
app.post('/contactMail', async (req, res) => {
  try {
    // const nodemailer = require("nodemailer");
    const EnquiryDatas = require('./models/EnquiryData');

    const { name, email, phone, subject, msg } = req.body;

    //  Save in Database
    await EnquiryDatas.create({
      name,
      email,
      phone,
      subject,
      msg,
      date: new Date()
    });

    //  Create Transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //  Send Mail to Admin
    await transporter.sendMail({
      from: `"Bharat Yatra" <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `New Contact: ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b> ${msg}</p>
        <br/>
        <p>Please respond to the customer soon.</p>
      `,
    });

    //  Send Auto Reply to Customer
    await transporter.sendMail({
      from: `"Bharat Yatra" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Thank You for Contacting Bharat Yatra",
      html: `
        <h2>Thank You for Contacting Us!</h2>
        <p>Dear ${name},</p>
        
        <p>We have successfully received your message regarding <b>${subject}</b>.</p>
        
        <p>Our team will get back to you shortly with the required information.</p>
        
        <p>If your query is urgent, please feel free to contact us directly.</p>
        
        <br/>
        <p>Best Regards,</p>
        <p><b>Bharat Yatra Team</b></p>
      `,
    });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});




//user packagedetails page sendenquiry for packageEnquiry Mail
app.post('/packageEnquiryMail', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      packageName,
      travelDate,
      adults,
      children,
      message
    } = req.body;

    const formattedDate = new Date(travelDate).toLocaleDateString("en-IN");

    //  Save enquiry in MongoDB
    const enquiry = await PackageEnquiry.create({
      name,
      phone,
      email,
      packageName,
      travelDate,
      adults,
      children,
      message,
      date: new Date()
    });

    //  Create Mail Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    //  Mail to Admin
    await transporter.sendMail({
      from: `"Bharat Yatra" <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `New Package Enquiry - ${packageName}`,
      html: `
<h2>New Package Enquiry Received</h2>
<hr/>

<h3>Customer Details</h3>
<p><b>Name:</b> ${name}</p>
<p><b>Email:</b> ${email}</p>
<p><b>Phone:</b> ${phone}</p>

<h3>Travel Details</h3>
<p><b>Package:</b> ${packageName}</p>
<p><b>Travel Date:</b> ${formattedDate}</p>
<p><b>Adults:</b> ${adults}</p>
<p><b>Children:</b> ${children}</p>

<h3>Message</h3>
<p>${message || "No message provided"}</p>

<br/>
<p>Please contact the customer soon.</p>
`
    });

    //  Auto Reply to Customer
    await transporter.sendMail({
      from: `"Bharat Yatra" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Your Enquiry Received - Bharat Yatra",
      html: `
        <h2>Thank You for Your Enquiry!</h2>

        <p>Dear <b>${name}</b>,</p>

        <p>We have received your enquiry for the following package:</p>

        <p><b>Package:</b> ${packageName}</p>
        <p><b>Travel Date:</b> ${formattedDate}</p>

        <p>Our team will contact you shortly with complete details.</p>

        <br/>

        <p>Best Regards,</p>
        <p><b>Bharat Yatra Team</b></p>
      `
    });

    res.json({
      success: true,
      message: "Enquiry Submitted Successfully"
    });

  } catch (error) {

    console.log("Enquiry Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
});

app.post('/addUserData', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await UserData.findOne({ email });

    if (existingUser) {
      return res.json({ flag: 0, msg: "Email already exists" });
    }


    //  HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Save user with hashed password
    const newUser = await UserData.create({
      name,
      email,
      password: hashedPassword,
      phone
    });


    //  Mail Transporter (same as yours)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //  Send Welcome Email
    const mailOptions = {
      from: `"Bharat Yatra" <${process.env.EMAIL_FROM}>`,
      to: newUser.email,
      subject: "Welcome to BharatYatra 🌍✨",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#2c3e50;">Welcome to BharatYatra, ${newUser.name}! 🎉</h2>
          
          <p style="font-size:16px;">
            Thank you for joining <b>BharatYatra</b> – your gateway to unforgettable travel experiences across India 🇮🇳
          </p>

          <p>
            We're excited to help you explore amazing destinations, discover curated packages, and plan your perfect journey.
          </p>

          <hr/>

          <h3>✨ What you can do now:</h3>
          <ul>
            <li>Browse travel packages</li>
            <li>Save your favorite trips ❤️</li>
            <li>Book your next adventure</li>
          </ul>

          <p style="margin-top:20px;">
            If you have any questions, feel free to reply to this email. We're here to help!
          </p>

          <p style="margin-top:30px;">
            Regards,<br/>
            <b>BharatYatra Team</b>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ flag: 1, msg: "Signup Successful" });

  } catch (err) {
    console.log("Signup error:", err);
    res.status(500).json({ flag: 0, msg: "Error occurred" });
  }
});

// Get user by email
app.get('/getUserDataByEmail/:email', async (req, res) => {
  try {
    const user = await UserData.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update user by email
app.put('/updateUserDataByEmail/:email', async (req, res) => {
  try {
    const updatedUser = await UserData.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


//Admin profile image upload
//Admin  Upload Avatar
app.post("/admin/uploadImage/:email", async (req, res) => {

  try {

    const { email } = req.params;

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const image = req.files.image;

    const fileName = image.name;   // image.jpg

    const uploadPath = "public/Images/admins/" + fileName;

    await image.mv(uploadPath);

    // save filename in DB
    const admin = await AdminData.findOneAndUpdate(
      { email },
      { image: fileName },
      { new: true }
    );

    res.json({
      message: "Image uploaded successfully",
      image: fileName
    });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Upload failed" });

  }

});


//user side Upload User Avatar
app.post("/uploadUserAvatar/:email", async (req, res) => {

  try {

    const { email } = req.params;

    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatar = req.files.avatar;

    const fileName = Date.now() + "_" + avatar.name;

    const uploadPath = "public/Images/users/" + fileName;

    await avatar.mv(uploadPath);

    const user = await UserData.findOneAndUpdate(
      { email },
      { avatar: fileName },
      { new: true }
    );

    res.json({
      message: "Avatar Uploaded Successfully",
      avatar: fileName
    });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Upload Failed" });

  }

});


//User  Get Avatar by Email
app.get("/getAvatar/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await UserData.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // If avatar exists, send the path
    if (user.avatar) {
      res.json({ avatar: user.avatar });
    } else {
      res.json({ avatar: null });
    }
  } catch (err) {
    console.error("Get Avatar Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


//user  Update user data by ID
app.put('/updateUserData/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body; // send full object: name, phone, address, etc.

    const user = await UserData.findByIdAndUpdate(userId, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


//user signin Sign in verify using below api
app.post('/loginUser', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserData.findOne({ email });

    //  user not found
    if (!user) {
      return res.json({ flag: 0, msg: "No Record Found" });
    }

    //  bcrypt compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ flag: 0, msg: "Invalid Password" });
    }

    //  JWT token generate
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    //  success response
    res.json({
      flag: 1,
      msg: "Success",
      token, // 🔥 IMPORTANT
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        memberSince: user.memberSince
      }
    });

  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ flag: 0, msg: "Server error" });
  }
});

//user ChangePassword API
app.post('/changePassword', async (req, res) => {  // <-- async added
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by email
    const user = await UserData.findOne({ email });  // <-- await works now
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


//user Forgot Password API
app.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // Find user by email
    const user = await UserData.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password) return res.status(400).json({ message: "User has no password set" });

    const tempPassword = Math.random().toString(36).slice(-8);

    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    user.password = hashedTempPassword;
    await user.save();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Mail options
    const mailOptions = {
      from: `"Bharat Yatra" <${process.env.EMAIL_FROM}>`,
      to: email, // send directly to user
      subject: "Your Password Recovery",
      text: `Hello ${user.name},\n\nYour current password is: ${user.password}`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Password sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});




app.get('/addPackagesStatic', (req, res) => {
  var pdata = {
    name: "Saputara Hill Station",
    location: 'Gujarat',
    image: '/Images/Gujarats.jpeg',
    days: 5,
    nights: 4,
    rating: 4.8,
    reviews: 50,
    tags: ['Nature', 'Family', 'Adventure'],
    originalPrice: 32999,
    price: 25999,
    discount: 21,
    themes: ['Family', 'Nature', 'Adventure'],
    season: 'Winter',
    destination: 'Gujarat',

  }


  var mydata = PackageData(pdata)
  mydata.save()
    .then(() => {
      res.send("Record Saved.")
    })
    .catch((err) => {
      res.send("Error in Record Add.")
    })
})

app.get('/addPackagesDynamic', (req, res) => {
  res.render('packages')   // this opens packages.ejs
})

app.post('/addPackagesDynamic', async (req, res) => {
  try {

    const newPackage = new PackageData({
      name: req.body.name,
      location: req.body.location,
      image: req.body.image,
      days: req.body.days,
      nights: req.body.nights,
      rating: req.body.rating,
      reviews: req.body.reviews,
      tags: [].concat(req.body.tags || []),
      originalPrice: req.body.originalPrice,
      price: req.body.price,
      discount: req.body.discount,
      themes: [].concat(req.body.themes || []),
      season: req.body.season,
      destination: req.body.destination
    })

    await newPackage.save()

    res.send("Dynamic Package Saved Successfully")

  } catch (error) {
    console.log(error)
    res.send("Error while saving package")
  }
})


//getpackages user side and also admin side
app.get('/getPackages', (req, res) => {
  PackageData.find()
    .then((mydata) => {

      res.json(mydata)
    })
    .catch((err) => { console.log(err) })
})


app.get('/addGoaPackageStaticAdmin', async (req, res) => {
  try {
    const pdata = {
      name: "Goa Beach Paradise",
      location: "Goa",
      image: "/Images/beach.jpeg",
      // Multiple Images for Auto Scroll
      images: [
        "/Images/beach.jpeg",
        "/Images/Gujarats.jpeg",
        "/Images/sd.jpeg"
      ],

      days: 6,
      nights: 5,
      rating: 4.7,
      reviews: 120,
      tags: ["Beach", "Adventure", "Friends"],

      originalPrice: 45999,
      price: 37999,
      discount: 17,

      themes: ["Beach", "Adventure", "Nightlife"],
      season: "Winter",
      destination: "Goa",

      description:
        "Enjoy the vibrant beaches, thrilling water sports, and exciting nightlife of Goa. A perfect holiday for friends and couples.",

      highlights: [
        "Baga & Calangute Beach Visit",
        "Water Sports Activities",
        "Dudhsagar Waterfalls",
        "Cruise Dinner Experience"
      ],

      bestSeason: ["Winter", "Monsoon"],

      // groupSize: "Min 2 persons",

      itinerary: [
        {
          day: 1,
          title: "Arrival & Beach Relaxation",
          subtitle: "Welcome to Goa",
          activities: [
            "Airport pickup & hotel check-in",
            "Evening at Baga Beach",
            "Beachside dinner"
          ]
        },
        {
          day: 2,
          title: "Water Sports Day",
          subtitle: "Adventure Time",
          activities: [
            "Parasailing",
            "Jet Ski Ride",
            "Banana Boat Ride"
          ]
        },
        {
          day: 3,
          title: "South Goa Exploration",
          subtitle: "Sightseeing Tour",
          activities: [
            "Visit Colva Beach",
            "Visit Basilica of Bom Jesus",
            "Shopping at local market"
          ]
        },
        {
          day: 4,
          title: "Dudhsagar Waterfall",
          subtitle: "Nature Adventure",
          activities: [
            "Jeep safari to Dudhsagar",
            "Photography session",
            "Relaxing evening"
          ]
        },
        {
          day: 5,
          title: "Cruise Night",
          subtitle: "Fun & Music",
          activities: [
            "Mandovi River cruise",
            "Live music & dance",
            "Dinner onboard"
          ]
        }
      ],

      included: [
        "4-star hotel accommodation",
        "Daily breakfast",
        "Airport transfers",
        "Sightseeing tours",
        "Water sports package"
      ],

      excluded: [
        "Flight tickets",
        "Personal expenses",
        "Extra adventure activities",
        "Travel insurance"
      ]
    };

    const mydata = new PackageData(pdata);
    await mydata.save();

    res.send("Goa Package Record Saved Successfully ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error in Record Add ❌");
  }
});



// for package details that should return with proper id 
app.get("/packages/:id", async (req, res) => {
  try {
    const package = await PackageData.findById(req.params.id);

    if (!package) {
      return res.status(404).json({ message: "Package Not Found" });
    }

    res.json(package);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//addpackagemodal addpackagedetailsdynamic
// app.post('/addPackageDetailsDynamic', async (req, res) => {
//   try {

//     let imageName = "";
//     let imagesArray = [];

//     // SINGLE IMAGE
//     if (req.files && req.files.image) {
//       const image = req.files.image;
//       imageName = image.name;
//       await image.mv("public/Images/" + imageName);
//     }

//     // MULTIPLE IMAGES (GALLERY)
//     if (req.files && req.files.images) {
//       const images = Array.isArray(req.files.images)
//         ? req.files.images
//         : [req.files.images];

//       for (let img of images) {
//         const fileName = Date.now() + "_" + img.name;
//         await img.mv("public/Images/" + fileName);
//         imagesArray.push(fileName);
//       }
//     }

//     const newPackage = new PackageData({
//       ...req.body,
//       image: imageName,
//       images: imagesArray, // ✅ IMPORTANT
//       tags: JSON.parse(req.body.tags),
//       themes: JSON.parse(req.body.themes),
//       bestSeason: JSON.parse(req.body.bestSeason),
//       highlights: JSON.parse(req.body.highlights),
//       included: JSON.parse(req.body.included),
//       excluded: JSON.parse(req.body.excluded),
//       itinerary: JSON.parse(req.body.itinerary),
//     });

//     await newPackage.save();

//     res.status(201).json({
//       flag: 1,
//       msg: "Package Added Successfully",
//       data: newPackage
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       flag: 0,
//       msg: "Package Not Added Successfully."
//     });
//   }
// });

//Package Added Dynamically admin adds
app.post('/addPackageDetailsDynamic', async (req, res) => {
  try {
    let imageName  = "";
    let imagesArray = [];
 
    // Single cover image
    if (req.files && req.files.image) {
      const image = req.files.image;
      imageName   = image.name;
      await image.mv("public/Images/" + imageName);
    }
 
    // Gallery images
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (let img of images) {
        const fileName =  img.name;
        await img.mv("public/Images/" + fileName);
        imagesArray.push(fileName);
      }
    }
 
    const newPackage = new PackageData({
      ...req.body,
      image:      imageName,
      images:     imagesArray,
      tags:       JSON.parse(req.body.tags),
      themes:     JSON.parse(req.body.themes),
      bestSeason: JSON.parse(req.body.bestSeason),
      highlights: JSON.parse(req.body.highlights),
      included:   JSON.parse(req.body.included),
      excluded:   JSON.parse(req.body.excluded),
      itinerary:  JSON.parse(req.body.itinerary),
      departures: req.body.departures ? JSON.parse(req.body.departures) : [],  // NEW
    });
 
    await newPackage.save();
 
    res.status(201).json({ flag: 1, msg: "Package Added Successfully", data: newPackage });
 
  } catch (err) {
    console.log(err);
    res.status(500).json({ flag: 0, msg: "Package Not Added Successfully." });
  }
});
 
 

app.put('/updatePackage/:id', async (req, res) => {
  try {
    const existing = await PackageData.findById(req.params.id);
    if (!existing) return res.status(404).json({ flag: 0, msg: "Package not found." });
 
    let imageName   = req.body.existingImage || existing.image;
    let imagesArray = [];
 
    if (req.files && req.files.image) {
      const image = req.files.image;
      imageName   = image.name;
      await image.mv("public/Images/" + imageName);
    }
 
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (let img of images) {
        const fileName = Date.now() + "_" + img.name;
        await img.mv("public/Images/" + fileName);
        imagesArray.push(fileName);
      }
    } else if (req.body.existingImages) {
      imagesArray = JSON.parse(req.body.existingImages);
    }
 
    const updated = await PackageData.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image:      imageName,
        images:     imagesArray,
        tags:       JSON.parse(req.body.tags),
        themes:     JSON.parse(req.body.themes),
        bestSeason: JSON.parse(req.body.bestSeason),
        highlights: JSON.parse(req.body.highlights),
        included:   JSON.parse(req.body.included),
        excluded:   JSON.parse(req.body.excluded),
        itinerary:  JSON.parse(req.body.itinerary),
        departures: req.body.departures ? JSON.parse(req.body.departures) : existing.departures,  // NEW
      },
      { new: true }
    );
 
    res.status(200).json({ flag: 1, msg: "Package Updated Successfully", data: updated });
 
  } catch (err) {
    console.log(err);
    res.status(500).json({ flag: 0, msg: "Package Not Updated Successfully." });
  }
});


app.delete('/deletePackage/:id',async (req,res) => {
    try{
      const {id} = req.params;
      await PackageData.findByIdAndDelete(id);
      res.status(200).json({msg : "Package Deleted Successfully."})
    }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete package" });
  }
});
 
 


app.post('/bookDeparture/:packageId/:departureId', async (req, res) => {
  try {
    const { packageId, departureId } = req.params;
    const travellers = Number(req.body.travellers) || 1;
 
    const pkg = await PackageData.findById(packageId);
    if (!pkg) return res.status(404).json({ flag: 0, msg: 'Package not found.' });
 
    const departure = pkg.departures.id(departureId);
    if (!departure) return res.status(404).json({ flag: 0, msg: 'Departure slot not found.' });
 
    const seatsLeft = departure.totalSeats - departure.bookedCount;
    if (seatsLeft < travellers) {
      return res.status(400).json({
        flag: 0,
        msg: `Only ${seatsLeft} seat(s) left for this departure.`,
      });
    }
 
    departure.bookedCount += travellers;
    await pkg.save();
 
    res.status(200).json({
      flag: 1,
      msg:  'Seats reserved.',
      data: {
        departureId,
        seatsLeft: departure.totalSeats - departure.bookedCount,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ flag: 0, msg: 'Booking failed.' });
  }
});






//update from addpackagemodal by admin
// app.put("/updatePackage/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     let updateData = { ...req.body };

//     // SINGLE IMAGE
//     if (req.files && req.files.image) {
//       const image = req.files.image;
//       const fileName = Date.now() + "_" + image.name;

//       await image.mv("public/Images/" + fileName);
//       updateData.image = fileName;
//     }

//     // MULTIPLE IMAGES
//     if (req.files && req.files.images) {
//       const images = Array.isArray(req.files.images)
//         ? req.files.images
//         : [req.files.images];

//       let imagesArray = [];

//       for (let img of images) {
//         const fileName = Date.now() + "_" + img.name;
//         await img.mv("public/Images/" + fileName);
//         imagesArray.push(fileName);
//       }

//       updateData.images = imagesArray;
//     } else if (req.body.existingImages) {
//       updateData.images = JSON.parse(req.body.existingImages);
//     }

//     // Parse JSON fields
//     updateData.tags = JSON.parse(req.body.tags || "[]");
//     updateData.themes = JSON.parse(req.body.themes || "[]");
//     updateData.bestSeason = JSON.parse(req.body.bestSeason || "[]");
//     updateData.highlights = JSON.parse(req.body.highlights || "[]");
//     updateData.included = JSON.parse(req.body.included || "[]");
//     updateData.excluded = JSON.parse(req.body.excluded || "[]");
//     updateData.itinerary = JSON.parse(req.body.itinerary || "[]");

//     const updatedPackage = await PackageData.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     );

//     res.json({
//       flag: 1,
//       msg: "Package Updated Successfully",
//       data: updatedPackage
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       flag: 0,
//       msg: "Update Failed"
//     });
//   }
// });



//enquiry form static
app.get('/addEnquiryStatic', (req, res) => {
  var edata = {
    name: "Name Surname",
    email: "name@gmail.com",
    phone: "91XXXXXXXx",
    subject: "Group Booking - Rajasthan",
    msg: "We are a group of 12 people planning a Rajasthan trip in December."
  }
  var addData = EnquiryData(edata)
  addData.save()
    .then(() => {
      res.send("Enquiry Send.")
    })
    .catch((err) => {
      res.send("Error in Save", err)
    })
})

//addenquirydyanamic from user side 
app.post('/addEnquiryDynamic', async (req, res) => {
  try {
    const newEnquiry = await EnquiryData.create(req.body);

    res.status(201).json({
      flag: 1,
      msg: "Enquiry Added Successfully",
      data: newEnquiry
    });

  } catch (err) {
    res.status(500).json({
      flag: 0,
      msg: "Failed to add enquiry"
    });
  }
});

//get enquiries on admin side [contactus - enquiry]
app.get('/getEnquiries', (req, res) => {
  EnquiryData.find()
    .then((addData) => {
      res.json(addData)
    })
    .catch((err) => {
      console.log("Error", err)
    })
})

//get enquiries on admin side [package - enquiry]
app.get('/getPackageEnquiries', (req, res) => {
  PackageEnquiry.find()
    .then((addDatas) => {
      res.json(addDatas)
    })
    .catch((err) => {
      console.log("Error", err)
    })
})


//Booking Data API
// app.post('/addBookingDetails', authMiddleware, async (req, res) => {
//   try {
//     const booking = await BookingData.create(req.body)
//     res.send({
//       flag: 1,
//       msg: "Booking Successful",
//       bookingId: booking._id
//     })
//   }
//   catch (err) {
//     res.send({
//       flag: 0,
//       msg: "Boooking Failed"
//     })
//   }
// })

app.post('/addBookingDetails', authMiddleware, async (req, res) => {
  try {
    const booking = await BookingData.create(req.body);
    res.send({
      flag:      1,
      msg:       'Booking Successful',
      bookingId: booking._id,
    });
  } catch (err) {
    console.error(err);
    res.send({ flag: 0, msg: 'Booking Failed' });
  }
});

app.get('/getBookings', async (req, res) => {
  try {
    const bookings = await BookingData.find();
    res.send(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Failed to fetch bookings" });
  }
});

//claude
// app.get('/getBookings', authMiddleware, async (req, res) => {
//   try {
//     const { email } = req.query;
//     const bookings  = await BookingData.find({ userEmail: email }).populate("packageId").sort({ bookingDate: -1 });
//     res.send({ flag: 1, data: bookings });
//   } catch (err) {
//     console.error(err);
//     res.send({ flag: 0, msg: 'Failed to fetch bookings.' });
//   }
// });

//mail goes when admin updates the status from adminpanel bookings
app.put('/updateBookingStatus/:id', async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ flag: '0', msg: 'Invalid status value' });
    }

    // Update in DB
    const updated = await BookingData.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return res.status(404).json({ flag: '0', msg: 'Booking not found' });
    }

    // ── Send Email Based on Status ──
    const userName = updated.travelers?.[0]?.name || 'Traveller';
    const userEmail = updated.userEmail;

    //  Create Mail Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const statusEmailMap = {

      Confirmed: {
        subject: `Your Booking is Confirmed! ✅ - ${updated.bookingId}`,
        html: `
          <h2>Booking Confirmed!</h2>
          <p>Dear <b>${userName}</b>,</p>
          <p>Great news! Your booking has been confirmed.</p>
          <p><b>Booking ID:</b> ${updated.bookingId}</p>
          <p><b>Package:</b> ${updated.packageName}</p>
          <p><b>Travel Date:</b> ${new Date(updated.departureDate).toLocaleDateString()}</p>
          <p><b>Total Amount:</b> ₹${updated.totalPrice?.toLocaleString()}</p>
          <p>Our team will reach out to you with further details shortly.</p>
          <br/>
          <p>Best Regards,</p>
          <p><b>BharatYatra Team</b></p>
        `
      },

      Completed: {
        subject: `Trip Completed - Thank You! 🎉 - ${updated.bookingId}`,
        html: `
          <h2>Thank You for Travelling with Us!</h2>
          <p>Dear <b>${userName}</b>,</p>
          <p>We hope you had an amazing experience on your trip.</p>
          <p><b>Booking ID:</b> ${updated.bookingId}</p>
          <p><b>Package:</b> ${updated.packageName}</p>
          <p>We'd love to hear your feedback. Reply to this email and let us know!</p>
          <br/>
          <p>Best Regards,</p>
          <p><b>BharatYatra Team</b></p>
        `
      },

      Cancelled: {
        subject: `Booking Cancelled - ${updated.bookingId}`,
        html: `
          <h2>Booking Cancelled</h2>
          <p>Dear <b>${userName}</b>,</p>
          <p>Your booking has been cancelled as per the request.</p>
          <p><b>Booking ID:</b> ${updated.bookingId}</p>
          <p><b>Package:</b> ${updated.packageName}</p>
          <p>If you have any questions, please reply to this email.</p>
          <br/>
          <p>Best Regards,</p>
          <p><b>BharatYatra Team</b></p>
        `
      }

    };

    // Send email only for Confirmed, Completed, Cancelled (not Pending)
    if (userEmail && statusEmailMap[status]) {
      try {
        const info = await transporter.sendMail({
          from: `"Bharat Yatra" <${process.env.EMAIL_FROM}>`,
          to: userEmail,
          subject: statusEmailMap[status].subject,
          html: statusEmailMap[status].html,
        });

        console.log("Email sent:", info.response);
      } catch (error) {
        console.error("Email error:", error);
      }
    }

    res.json({ flag: '1', msg: `Status updated to ${status}`, data: updated });

  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ flag: '0', msg: 'Server error' });
  }
});


app.get("/getUserData", async (req, res) => {
  try {
    const users = await UserData.find(); // fetch all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get("/getUserData/:id", async (req, res) => {
  try {

    const user = await UserData.findById(req.params.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });

  } catch (err) {

    res.status(500).json({ success: false, message: err.message });

  }
});




//admin edit profile 

// Get Admin Profile
app.get("/admin/getProfile/:email", async (req, res) => {
  try {

    const admin = await AdminData.findOne({ email: req.params.email });

    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    res.json(admin);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// Update Admin Profile
app.put("/admin/updateProfile/:email", async (req, res) => {

  try {

    const admin = await AdminData.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );

    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    res.json({
      message: "Profile updated successfully",
      admin
    });

  } catch (err) {

    res.status(500).json({ message: "Server Error" });

  }

});


// Get Admin Avatar
app.get("/admin/getAvatar/:email", async (req, res) => {

  try {

    const admin = await AdminData.findOne({ email: req.params.email });

    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    res.json({
      image: admin.image
    });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

});

// add rating and reviews
app.post("/addReview", async (req, res) => {

  try {

    const newReview = new ReviewData(req.body);

    await newReview.save();

    res.json({
      success: true,
      message: "Review Added Successfully"
    });

  } catch (err) {

    res.json({
      success: false,
      message: "Error Adding Review"
    });

  }

});


//getreview
app.get("/getReviews/:packageId", async (req, res) => {

  try {

    const reviews = await ReviewData.find({
      packageId: req.params.packageId
    }).sort({ createdAt: -1 });

    res.json(reviews);

  } catch (err) {

    res.json([]);
  }

});

//getallreviews
app.get("/getAllReviews", async (req, res) => {
  try {
    const reviews = await ReviewData.find()
      .populate("packageId")   // 🔥 important
      .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (err) {
    res.json([]);
  }
});

app.get("/getUserReviews/:email", async (req, res) => {
  try {
    const reviews = await ReviewData.find({
      userEmail: req.params.email
    })
      .populate("packageId")
      .sort({ createdAt: -1 });

    console.log("Reviews Data : ", reviews);

    res.json(reviews);
  } catch (err) {
    res.json([]);
  }
});


//admin can see Reviews
app.get("/admin/reviews", async (req, res) => {

  const reviews = await ReviewData.find()
    .populate("packageId");

  res.json(reviews);

});


//admin can delete reviews
app.delete("/deleteReview/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;

    const deletedReview = await ReviewData.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({
        message: "Review Not Found",
      });
    }

    res.json({
      message: "Review Deleted Successfully",
    });

  } catch (err) {
    console.log("Delete error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});





const WishlistData = require('./models/WishlistData');
//user wishlist store in db
app.post("/wishlist/add", authMiddleware, async (req, res) => {
  const { userId, packageId } = req.body;

  const exists = await WishlistData.findOne({ userId, packageId });
  if (exists) return res.json({ message: "Already added" });

  const item = new WishlistData({ userId, packageId });
  await item.save();

  res.json({ message: "Added to wishlist" });
});

//user wishlist get on ui   - when user loggs in so at that time get wishlist
app.get("/wishlist/:userId", async (req, res) => {
  const data = await WishlistData.find({ userId: req.params.userId })
    .populate("packageId");

  res.json(data);
});

app.get("/admin/wishlist", async (req, res) => {
  try {

    const data = await WishlistData.find()
      .populate({
        path: "userId",
        select: "name email"
      })
      .populate({
        path: "packageId",
        select: "name"
      });

    console.log("Wishlist Data:", data); // 

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching wishlist" });
  }
});

//user removed wishlist so remove from db
app.delete("/wishlist/remove", async (req, res) => {
  const { userId, packageId } = req.body;

  await WishlistData.deleteOne({ userId, packageId });

  res.json({ message: "Removed" });
});







app.listen(port, () => {
  console.log(`App Listning on ${port}`)
})