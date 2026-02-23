import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaGift,
  FaUsers,
  FaDollarSign,
  FaStar,
  FaCheckCircle,
  FaTicketAlt,
  FaCoins,
  FaShieldAlt,
  FaMedal,
  FaFire,
  FaPercentage,
  FaChevronLeft,
  FaChevronRight,
  FaTag,
  FaAward,
  FaBoxOpen,
  FaShippingFast,
} from "react-icons/fa";
import localforage from "localforage";
import Api from "../components/Api";

const Giveaways = () => {
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [userPoints, setUserPoints] = useState(250);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    try {
      const token = await localforage.getItem("authToken");
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = await getToken();
    if (!token) {
      toast.error("Please login to enter giveaways");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${Api}/getUser`, { token });

      if (response.data.success) {
        const user = response.data.user;
        setUserData(user);
        setUserPoints(user.balance || 250);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to load user data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prizes = [
    {
      id: 1,
      title: "Omega Speedmaster / Seamaster Watch Vault",
      category: "Luxury Timepieces",
      marketValueSAR: "350,000 SAR",
      marketValueUSD: "$93,500",
      description:
        "Curated collection of Omega's finest Speedmaster & Seamaster professional timepieces with certification.",
      entryCost: 50,
      timeRemaining: { hours: 12, minutes: 45 },
      totalEntries: 1250,
      userEntries: 3,
      maxEntries: 100,
      convertible: true,
      color: "from-slate-800 via-gray-700 to-gray-900",
      rarity: "Ultra Exclusive",
      badge: "Swiss Master",
      features: ["Multiple Models", "Full Certification", "Display Cases"],
      rating: 5,
      isPopular: true,
      collectorGrade: "A+++",
      imageUrl:
        "https://i.pinimg.com/1200x/1b/40/cf/1b40cf113206cd1315d9e521d69c8f0c.jpg",
      winnerCount: 1,
      requirements: "Must be 18+ years old, Worldwide shipping included",
      details: {
        fullDescription:
          "This is a curated collection of Omega's finest Speedmaster & Seamaster professional timepieces with full certification.",
        shippingInfo: "Free worldwide insured shipping via DHL Express",
        authentication: "Comes with Omega certificates and verification",
        restrictions: "Cannot be resold within 1 year of receipt",
        claimProcess:
          "Winner will be contacted within 24 hours of draw completion",
      },
      shippingFeeUSD: 6500,
      shippingFeeSAR: "9,375 SAR",
      isActive: false,
    },
    {
      id: 2,
      title: "Rolex Professional Series Watch Vault",
      category: "Luxury Timepieces",
      marketValueSAR: "1,200,000 SAR",
      marketValueUSD: "$320,000",
      description:
        "Complete Rolex Professional Series collection including Daytona, Submariner, GMT-Master II.",
      entryCost: 75,
      timeRemaining: { days: 2, hours: 6, minutes: 30 },
      totalEntries: 8900,
      userEntries: 1,
      maxEntries: 50,
      convertible: true,
      color: "from-green-600 via-emerald-700 to-green-900",
      rarity: "Museum Grade",
      badge: "Rolex Collection",
      features: [
        "Professional Series Set",
        "Rolex Certification",
        "Investment Grade",
      ],
      rating: 5,
      isNew: true,
      collectorGrade: "A++++",
      imageUrl:
        "https://i.pinimg.com/1200x/1b/28/96/1b28966ac0175731c976cc7c88475e2d.jpg",
      winnerCount: 1,
      requirements: "Legal adult, Must have insurance",
      details: {
        fullDescription:
          "Complete Rolex Professional Series collection with full authentication and certification from Rolex.",
        shippingInfo: "Armored delivery worldwide",
        authentication: "Rolex certificates and hologram verification",
        restrictions: "Must maintain insurance for first year",
        claimProcess: "Winner must complete KYC verification before delivery",
      },
      shippingFeeUSD: 7000,
      shippingFeeSAR: "11,250 SAR",
      isActive: false,
    },
    {
      id: 3,
      title: "Cartier / Bulgari High-Jewelry Set",
      category: "Luxury Jewelry",
      marketValueSAR: "2,500,000 SAR",
      marketValueUSD: "$667,000",
      description:
        "Exquisite high-jewelry collection featuring diamonds, emeralds, and rare gemstones from premier maisons.",
      entryCost: 100,
      timeRemaining: { days: 7, hours: 12, minutes: 15 },
      totalEntries: 25000,
      userEntries: 0,
      maxEntries: 200,
      convertible: true,
      color: "from-pink-500 via-rose-600 to-red-600",
      rarity: "Ultra Rare",
      badge: "Haute Joaillerie",
      features: ["GIA Certified", "Designer Pieces", "Secure Vault"],
      rating: 5,
      isPopular: true,
      collectorGrade: "A++++",
      imageUrl:
        "https://i.pinimg.com/1200x/bf/73/d0/bf73d073d82387b50a0befd3fb31d9a8.jpg",
      winnerCount: 1,
      requirements: "Insurance registration required",
      details: {
        fullDescription:
          "Exquisite high-jewelry collection featuring diamonds, emeralds, and rare gemstones from Cartier and Bulgari.",
        shippingInfo: "Brinks armored delivery worldwide",
        authentication: "GIA certification and designer certificates",
        restrictions: "Must have valid insurance",
        claimProcess: "Winner chooses delivery location and time",
      },
      shippingFeeUSD: 7000,
      shippingFeeSAR: "11,250 SAR",
      isActive: false,
    },
    {
      id: 4,
      title: "Signed Match-Worn Double Jersey Vault",
      category: "Football Memorabilia",
      marketValueSAR: "450,000 SAR",
      marketValueUSD: "$120,000",
      description:
        "Authentic match-worn jerseys from legendary encounters, signed and preserved in museum-quality display.",
      entryCost: 60,
      timeRemaining: { days: 3, hours: 8, minutes: 20 },
      totalEntries: 7800,
      userEntries: 2,
      maxEntries: 100,
      convertible: true,
      color: "from-blue-600 via-indigo-700 to-purple-800",
      rarity: "Legendary Matches",
      badge: "Historic",
      features: [
        "Multiple Legends",
        "Match Documentation",
        "Conservation Grade",
      ],
      rating: 5,
      collectorGrade: "A+++",
      imageUrl:
        "https://i.pinimg.com/736x/aa/17/5b/aa175bab13eb2070bc62df354172f98a.jpg",
      winnerCount: 2,
      requirements: "Must be football enthusiast",
      details: {
        fullDescription:
          "Authentic match-worn jerseys from legendary football encounters, signed and preserved.",
        shippingInfo: "Insured shipping worldwide",
        authentication: "Match certificates and authentication papers",
        restrictions: "Display case included",
        claimProcess: "Winner receives digital verification first",
      },
      shippingFeeUSD: 6000,
      shippingFeeSAR: "7,500 SAR",
      isActive: false,
    },
    {
      id: 5,
      title: "Cristiano Ronaldo Signed Career Milestone Frame",
      category: "Legend Memorabilia",
      marketValueSAR: "850,000 SAR",
      marketValueUSD: "$227,000",
      description:
        "Chronological display of CR7's career milestones with authenticated signatures from each era.",
      entryCost: 80,
      timeRemaining: { days: 5, hours: 10, minutes: 45 },
      totalEntries: 6800,
      userEntries: 0,
      maxEntries: 150,
      convertible: true,
      color: "from-red-600 via-red-700 to-rose-900",
      rarity: "Career Spanning",
      badge: "CR7 Legacy",
      features: ["Career Timeline", "Multiple Signatures", "Museum Display"],
      rating: 5,
      isNew: true,
      collectorGrade: "A++++",
      imageUrl:
        "https://i.pinimg.com/736x/bb/12/89/bb1289ca8b5e7c55e722afd68020f128.jpg",
      winnerCount: 1,
      requirements: "CR7 fan, Must provide display space",
      details: {
        fullDescription:
          "Chronological display of Cristiano Ronaldo's career milestones with authenticated signatures.",
        shippingInfo: "Specialized art shipping worldwide",
        authentication: "Signature authentication certificates",
        restrictions: "Requires proper display space",
        claimProcess: "Professional installation available",
      },
      shippingFeeUSD: 6500,
      shippingFeeSAR: "9,375 SAR",
      isActive: false,
    },
    {
      id: 6,
      title: "Apple Ultra Tech Vault",
      category: "Premium Technology",
      marketValueSAR: "180,000 SAR",
      marketValueUSD: "$48,000",
      description:
        "Complete Apple ecosystem with Vision Pro, Mac Studio, and custom professional configurations.",
      entryCost: 50,
      timeRemaining: { days: 14, hours: 0, minutes: 0 },
      totalEntries: 45000,
      userEntries: 4,
      maxEntries: 500,
      convertible: true,
      color: "from-gray-700 via-gray-800 to-black",
      rarity: "Pro Configuration",
      badge: "Apple Ultimate",
      features: ["Full Ecosystem", "Pro Configurations", "Setup Service"],
      rating: 4,
      collectorGrade: "A++",
      imageUrl:
        "https://i.pinimg.com/736x/5a/ad/ef/5aadef3416eb79570a34a3d2bef49b04.jpg",
      winnerCount: 10,
      requirements: "Tech enthusiast, Must have Apple ID",
      details: {
        fullDescription:
          "Complete Apple ecosystem with professional configurations and setup service.",
        shippingInfo: "Apple Store delivery or shipping",
        authentication: "Apple warranty and receipts",
        restrictions: "Must be 18+ years old",
        claimProcess: "Personal setup session included",
      },
      shippingFeeUSD: 7000,
      shippingFeeSAR: "9,375 SAR",
      isActive: false,
    },
    {
      id: 7,
      title: "Five-Star Hospitality Credit Vault",
      category: "Luxury Lifestyle",
      marketValueSAR: "1,000,000 SAR",
      marketValueUSD: "$267,000",
      description:
        "Unlimited five-star hospitality credits for global luxury hotels, resorts, and fine dining.",
      entryCost: 90,
      timeRemaining: { days: 10, hours: 5, minutes: 30 },
      totalEntries: 15000,
      userEntries: 1,
      maxEntries: 80,
      convertible: true,
      color: "from-amber-500 via-orange-600 to-red-600",
      rarity: "Unlimited Access",
      badge: "Global Luxury",
      features: ["Global Network", "Unlimited Credits", "Concierge Service"],
      rating: 5,
      collectorGrade: "A++++",
      imageUrl:
        "https://i.pinimg.com/1200x/1f/60/48/1f60480f9dcfea15cf73c399766c89ac.jpg",
      winnerCount: 5,
      requirements: "Valid passport, Travel enthusiast",
      details: {
        fullDescription:
          "Unlimited five-star hospitality credits for global luxury travel experiences.",
        shippingInfo: "Digital delivery via secure portal",
        authentication: "Verified membership platform",
        restrictions: "Must be used within 36 months",
        claimProcess: "Personal concierge assigned",
      },
      shippingFeeUSD: 6300,
      shippingFeeSAR: "9,375 SAR",
      isActive: false,
    },
    {
      id: 8,
      title: "Luxury Fashion Trunk (Louis Vuitton / Dior / Hermès)",
      category: "Haute Couture",
      marketValueSAR: "680,000 SAR",
      marketValueUSD: "$181,000",
      description:
        "Curated collection of luxury fashion pieces from premier maisons with personal styling service.",
      entryCost: 70,
      timeRemaining: { days: 6, hours: 9, minutes: 15 },
      totalEntries: 9800,
      userEntries: 2,
      maxEntries: 120,
      convertible: true,
      color: "from-brown-600 via-amber-800 to-yellow-900",
      rarity: "Designer Collection",
      badge: "Haute Couture",
      features: ["Multiple Designers", "Personal Styling", "Seasonal Updates"],
      rating: 5,
      isNew: true,
      collectorGrade: "A+++",
      imageUrl:
        "https://i.pinimg.com/736x/f8/77/4d/f8774dbd5b2ddda1f5f9b70bb475920c.jpg",
      winnerCount: 3,
      requirements: "Fashion enthusiast, Size consultation needed",
      details: {
        fullDescription:
          "Curated luxury fashion collection with personal styling service.",
        shippingInfo: "Designer store delivery or shipping",
        authentication: "Designer authenticity cards",
        restrictions: "Size consultation required",
        claimProcess: "Personal styling session included",
      },
      shippingFeeUSD: 6500,
      shippingFeeSAR: "9,375 SAR",
      isActive: false,
    },
    {
      id: 9,
      title: "2026 Cadillac Escalade-V Super-SUV Vault",
      category: "Ultra-Luxury Performance SUV",
      marketValueSAR: "650,000 SAR",
      marketValueUSD: "$173,500",
      description:
        "The most powerful Cadillac ever built with supercharged 6.2L V-8, 682 horsepower, and 55-inch curved OLED display.",
      entryCost: 85,
      timeRemaining: { days: 4, hours: 7, minutes: 45 },
      totalEntries: 12000,
      userEntries: 0,
      maxEntries: 60,
      convertible: false,
      color: "from-gray-900 via-slate-800 to-slate-950",
      rarity: "Super Flagship",
      badge: "Super-SUV",
      features: [
        "682 HP Supercharged V8",
        "AKG 42-Speaker Audio",
        "Semi-Aniline Leather",
      ],
      rating: 5,
      isNew: true,
      collectorGrade: "A++",
      imageUrl:
        "https://i.pinimg.com/1200x/31/04/03/3104034cdc1820e6c58cdb44fd762b0e.jpg",
      winnerCount: 1,
      requirements: "Valid driver's license, Must be 21+",
      details: {
        fullDescription:
          "2026 Cadillac Escalade-V with full performance package and luxury features.",
        shippingInfo: "Dealer delivery anywhere worldwide",
        authentication: "Manufacturer documents and title",
        restrictions: "Must have valid insurance",
        claimProcess: "VIP dealer experience included",
      },
      shippingFeeUSD: 7000,
      shippingFeeSAR: "11,250 SAR",
      isActive: false,
    },
    {
      id: 10,
      title: "BMW M3 Competition xDrive Sedan Performance Vault",
      category: "German High-Performance Sedan",
      marketValueSAR: "400,000 SAR",
      marketValueUSD: "$106,580",
      description:
        "2025 BMW M3 Competition with xDrive all-wheel drive in exclusive Ruby Star Neo paint.",
      entryCost: 65,
      timeRemaining: { days: 3, hours: 4, minutes: 20 },
      totalEntries: 8500,
      userEntries: 1,
      maxEntries: 75,
      convertible: false,
      color: "from-rose-800 via-red-700 to-ruby-900",
      rarity: "Sports Sedan Elite",
      badge: "///M Power",
      features: [
        "M Carbon Bucket Seats",
        "Executive Package",
        "Carbon Fiber Trim",
      ],
      rating: 5,
      isPopular: true,
      collectorGrade: "A+++",
      imageUrl:
        "https://i.pinimg.com/736x/f6/fc/e7/f6fce7399b56980e8ad4810d35a0d8ab.jpg",
      winnerCount: 1,
      requirements: "Valid driver's license, Performance driving experience",
      details: {
        fullDescription:
          "2025 BMW M3 Competition xDrive with exclusive paint and full performance package.",
        shippingInfo: "BMW Performance Center delivery",
        authentication: "BMW certificates and ownership papers",
        restrictions: "Performance driving course recommended",
        claimProcess: "BMW Driving Experience included",
      },
      shippingFeeUSD: 6800,
      shippingFeeSAR: "10,500 SAR",
      isActive: false,
    },
    {
      id: 11,
      title: "1300HP Twin-Turbo 1969 Camaro Restomod Vault",
      category: "American Icon Restomod",
      marketValueSAR: "1,125,000 SAR",
      marketValueUSD: "$300,000",
      description:
        "Purpose-built '69 Camaro engineered to modern supercar standards with twin-turbo LSX V8 producing 1,300 horsepower.",
      entryCost: 100,
      timeRemaining: { days: 8, hours: 2, minutes: 10 },
      totalEntries: 5600,
      userEntries: 0,
      maxEntries: 40,
      convertible: false,
      color: "from-gray-700 via-gray-600 to-slate-500",
      rarity: "SEMA Masterpiece",
      badge: "Restomod Legend",
      features: [
        "1,300 HP LME LSX Engine",
        "Detroit Speed Chassis",
        "Custom PPG Finish",
      ],
      rating: 5,
      isNew: true,
      collectorGrade: "A++++",
      imageUrl:
        "https://i.pinimg.com/736x/1c/16/46/1c1646ddc0a64f8cf0be0f69805a0fa6.jpg",
      winnerCount: 1,
      requirements: "Experienced driver, Track training recommended",
      details: {
        fullDescription:
          "1969 Camaro restomod with modern supercar performance and engineering.",
        shippingInfo: "Enclosed trailer delivery worldwide",
        authentication: "Build documentation and certifications",
        restrictions: "Track training recommended",
        claimProcess: "Build tour with engineers included",
      },
      shippingFeeUSD: 7000,
      shippingFeeSAR: "11,250 SAR",
      isActive: false,
    },
  ];

  const maxIndex = Math.max(0, prizes.length - itemsPerView);
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };
  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex, maxIndex]);

  const visiblePrizes = prizes.slice(currentIndex, currentIndex + itemsPerView);

  const handleClaimPrize = (prize) => {
    if (!userData) {
      toast.error("Please login to enter giveaways");
      return;
    }

    if (userPoints < prize.entryCost) {
      toast.error(
        `You need ${prize.entryCost - userPoints} more points to enter this giveaway. Complete tasks to earn more points!`,
      );
      return;
    }
    setSelectedPrize(prize);
  };

  const handleConfirmEntry = async () => {
    if (!selectedPrize || !userData) return;

    const token = await getToken();
    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    try {
      // Create complete prize object with all data
      const prizeData = {
        id: selectedPrize.id,
        title: selectedPrize.title,
        category: selectedPrize.category,
        marketValueSAR: selectedPrize.marketValueSAR,
        marketValueUSD: selectedPrize.marketValueUSD,
        description: selectedPrize.description,
        entryCost: selectedPrize.entryCost,
        convertible: selectedPrize.convertible,
        color: selectedPrize.color,
        rarity: selectedPrize.rarity,
        badge: selectedPrize.badge,
        features: selectedPrize.features,
        rating: selectedPrize.rating,
        isPopular: selectedPrize.isPopular,
        isNew: selectedPrize.isNew,
        collectorGrade: selectedPrize.collectorGrade,
        imageUrl: selectedPrize.imageUrl,
        winnerCount: selectedPrize.winnerCount,
        requirements: selectedPrize.requirements,
        details: selectedPrize.details,
        shippingFeeUSD: selectedPrize.shippingFeeUSD,
        shippingFeeSAR: selectedPrize.shippingFeeSAR,
        isActive: false, // Initially inactive until user wins
      };

      const data = {
        token,
        userId: userData._id,
        prizeId: selectedPrize.id,
        prizeDetails: prizeData, // Send complete prize data
        entryCost: selectedPrize.entryCost,
      };

      // Send entry to backend
      const response = await axios.post(`${Api}/enter`, data);

      if (response.data.success) {
        // Update local state
        setUserPoints((prev) => prev - selectedPrize.entryCost);

        // Update user data
        if (response.data.user) {
          setUserData(response.data.user);
          setUserPoints(response.data.user.balance);
        }

        // Update prize entries in local array
        const prizeIndex = prizes.findIndex((p) => p.id === selectedPrize.id);
        if (prizeIndex !== -1) {
          prizes[prizeIndex].userEntries++;
          prizes[prizeIndex].totalEntries++;
        }

        toast.success(
          `Successfully entered ${selectedPrize.title} giveaway! ${selectedPrize.entryCost} points deducted. Good luck!`,
        );
        setSelectedPrize(null);
      }
    } catch (error) {
      console.error("Entry error:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to enter giveaway";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <Toaster position="top-center" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-800/30 to-blue-900/20 rounded-xl p-4 border border-blue-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Total Prize Value</p>
                <p className="text-lg font-bold text-white">SAR 200.035M</p>
              </div>
              <FaDollarSign className="text-yellow-400 text-lg" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-800/30 to-emerald-900/20 rounded-xl p-4 border border-emerald-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm">Your Points</p>
                <p className="text-xl font-bold text-white">{userPoints}</p>
              </div>
              <FaCoins className="text-yellow-400 text-lg" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Carousel Section */}
      <div className="relative mb-12">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-800/80 to-blue-900/80 border border-blue-700/50 flex items-center justify-center text-white hover:text-yellow-400 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-800/80 to-blue-900/80 border border-blue-700/50 flex items-center justify-center text-white hover:text-yellow-400 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
          aria-label="Next slide"
        >
          <FaChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visiblePrizes.map((prize) => (
              <motion.div
                key={prize.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="h-full"
              >
                {/* Prize Card */}
                <div className="h-full bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-700/50 rounded-3xl p-6 backdrop-blur-sm hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 overflow-hidden">
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="flex items-center space-x-2">
                      {prize.isPopular && (
                        <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full flex items-center">
                          <FaFire className="mr-1" /> Hot
                        </span>
                      )}
                      {prize.isNew && (
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-bold rounded-full">
                          NEW
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 bg-gradient-to-br ${prize.color.split(" ").slice(0, 2).join(" ")} text-white text-xs font-bold rounded-full`}
                      >
                        {prize.badge}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="flex flex-col items-end">
                      <div className="flex justify-end">
                        {[...Array(prize.rating)].map((_, i) => (
                          <FaStar
                            key={i}
                            className="w-3 h-3 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="relative mb-6 mt-10">
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden">
                      <img
                        src={prize.imageUrl}
                        alt={prize.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>

                    {/* Collector Grade */}
                    <div className="absolute -bottom-3 right-4">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-gray-900 to-gray-800 border border-yellow-500/30 rounded-lg shadow-lg">
                        <div className="text-xs text-gray-400">Grade</div>
                        <div className="text-base font-bold text-yellow-400">
                          {prize.collectorGrade}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                      {prize.category}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 hover:text-yellow-400 transition-colors line-clamp-2">
                      {prize.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {prize.description}
                    </p>

                    {/* Market Value Display */}
                    <div className="mb-4 p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-400">
                          Market Value
                        </div>
                        <FaTag className="text-green-400" />
                      </div>
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-lg font-bold text-white">
                            {prize.marketValueSAR}
                          </div>
                          <div className="text-xs text-gray-400">SAR</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-400">
                            {prize.marketValueUSD}
                          </div>
                          <div className="text-xs text-gray-400">
                            USD Equivalent
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Entry Info */}
                    <div className="grid grid-cols-1 gap-3 mb-4">
                      <div className="bg-blue-900/30 rounded-lg p-2 text-center">
                        <div className="text-xs text-blue-300 mb-1">Cost</div>
                        <div className="text-lg font-bold text-yellow-300">
                          {prize.entryCost} pts
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {prize.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full border border-gray-700"
                          >
                            {feature}
                          </span>
                        ))}
                        {prize.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full border border-gray-700">
                            +{prize.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleClaimPrize(prize)}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-3 ${
                      userPoints >= prize.entryCost
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 shadow-lg shadow-yellow-500/30"
                        : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FaTicketAlt />
                    <span>
                      {userPoints >= prize.entryCost
                        ? `Enter Giveaway (${prize.entryCost} pts)`
                        : `Need ${prize.entryCost - userPoints} more pts`}
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center mt-8 space-x-3">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-gradient-to-r from-yellow-400 to-yellow-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-center mt-4 text-gray-400 text-sm">
          <span className="text-yellow-400 font-bold">
            {currentIndex + 1} -{" "}
            {Math.min(currentIndex + itemsPerView, prizes.length)}
          </span>{" "}
          of {prizes.length} giveaways
        </div>
      </div>

      {/* Prize Details Modal */}
      <AnimatePresence>
        {selectedPrize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 z-50"
            onClick={() => setSelectedPrize(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-yellow-500/30 rounded-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-3 border-b border-yellow-500/20 bg-gradient-to-r from-blue-900/50 to-blue-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        {selectedPrize.title}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPrize(null)}
                    className="p-2 hover:bg-blue-800/50 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-2">
                {/* Important Notice */}
                <div className="mb-6 p-2 bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 border-2 border-yellow-500/30 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <FaShieldAlt className="text-yellow-400 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-yellow-300 mb-1">
                        Important Notice
                      </h4>
                      <p className="text-blue-100">
                        You can only receive this prize if you are selected as
                        the winner in the random draw.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    {/* Prize Image */}
                    <div className="mb-6">
                      <div className="relative w-full h-64 rounded-2xl overflow-hidden">
                        <img
                          src={selectedPrize.imageUrl}
                          alt={selectedPrize.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Prize Value */}
                    <div className="mb-2">
                      <h3 className="text-lg font-bold mb-3 flex items-center">
                        <FaDollarSign className="mr-2 text-yellow-400" />
                        Prize Value & Shipping
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-4 border border-blue-700/30 text-center">
                          <div className="text-blue-300 text-sm mb-1">
                            Market Value
                          </div>
                          <div className="text-xl font-bold text-white">
                            {selectedPrize.marketValueSAR}
                          </div>
                          <div className="text-gray-400 text-xs">
                            Saudi Riyal
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl p-4 border border-emerald-700/30 text-center">
                          <div className="text-emerald-300 text-sm mb-1">
                            USD Equivalent
                          </div>
                          <div className="text-xl font-bold text-white">
                            {selectedPrize.marketValueUSD}
                          </div>
                          <div className="text-gray-400 text-xs">
                            US Dollars
                          </div>
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-xl p-4 border border-amber-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <FaShippingFast className="text-amber-400" />
                            <span className="text-amber-300 font-semibold">
                              Shipping & Handling
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">
                              USD
                            </div>
                            <div className="text-lg font-bold text-white">
                              ${selectedPrize.shippingFeeUSD}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">
                              SAR
                            </div>
                            <div className="text-lg font-bold text-white">
                              {selectedPrize.shippingFeeSAR}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                          {selectedPrize.details.shippingInfo}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Prize Details */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-3 flex items-center">
                        <FaBoxOpen className="mr-2 text-blue-400" />
                        Prize Details
                      </h3>
                      <p className="text-blue-100 mb-4">
                        {selectedPrize.details.fullDescription}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <FaCheckCircle className="text-emerald-400 mt-1 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-blue-300">
                              Authentication:
                            </span>
                            <p className="text-blue-100">
                              {selectedPrize.details.authentication}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <FaShieldAlt className="text-yellow-400 mt-1 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-blue-300">
                              Claim Process:
                            </span>
                            <p className="text-blue-100">
                              {selectedPrize.details.claimProcess}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <FaMedal className="text-purple-400 mt-1 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-blue-300">
                              Status:
                            </span>
                            <p className="text-blue-100">
                              {selectedPrize.isActive
                                ? "Active (Winner Selected)"
                                : "Inactive (Drawing Pending)"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-bold mb-2 text-blue-300">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPrize.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-blue-900/40 text-blue-100 text-sm rounded-lg border border-blue-700/50"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mb-2 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1">
                    {userPoints < selectedPrize.entryCost && (
                      <div className="p-4 bg-gradient-to-r from-amber-900/30 to-amber-800/20 rounded-xl border border-amber-600/30">
                        <div className="flex items-center space-x-3">
                          <FaTicketAlt className="text-amber-400" />
                          <div>
                            <p className="font-bold text-amber-300">
                              Insufficient Points
                            </p>
                            <p className="text-sm text-blue-200">
                              You need {selectedPrize.entryCost - userPoints}{" "}
                              more points to enter. Complete tasks to earn more
                              points!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSelectedPrize(null)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmEntry}
                      disabled={userPoints < selectedPrize.entryCost}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/30"
                    >
                      <FaTicketAlt />
                      <span>
                        Enter Giveaway ({selectedPrize.entryCost} points)
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-blue-900/50 border-t border-blue-700/30 text-center text-sm text-blue-300">
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <FaShieldAlt className="text-emerald-400" />
                    <span>100% Secure Entry</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheckCircle className="text-yellow-400" />
                    <span>Verified Prizes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaPercentage className="text-blue-400" />
                    <span>Random Selection</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Giveaways;
