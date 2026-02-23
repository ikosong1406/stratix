import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaTrophy,
  FaClock,
  FaDollarSign,
  FaCoins,
  FaChevronLeft,
  FaChevronRight,
  FaTag,
  FaShippingFast,
  FaNewspaper,
  FaCalendar,
  FaShareAlt,
  FaHeart,
  FaComment,
  FaExchangeAlt,
  FaTruck,
  FaCheck,
  FaWhatsapp,
  FaInfoCircle,
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
  const [alNassrNews, setAlNassrNews] = useState([]);
  const [userPrizes, setUserPrizes] = useState([]);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedPrizeForAction, setSelectedPrizeForAction] = useState(null);
  const [conversionRate] = useState(100); // USD value / 100

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
    fetchAlNassrNews();
  }, []);

  const fetchUserData = async () => {
    const token = await getToken();
    if (!token) {
      toast.error("Please login to view your prizes");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${Api}/getUser`, { token });

      if (response.data.success) {
        const user = response.data.user;
        setUserData(user);
        setUserPoints(user.balance || 250);
        setUserPrizes(user.prizes || []);
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

  const fetchAlNassrNews = async () => {
    try {
      // Latest Al-Nassr news (as of Feb 2026)
      const news = [
        {
          id: 1,
          title: "Al-Nassr Wins Saudi Super Cup 2026",
          description:
            "Al-Nassr clinches the Saudi Super Cup with a stunning 3-1 victory over Al-Hilal in Riyadh.",
          date: "February 2, 2026",
          category: "Trophy Win",
          imageUrl:
            "https://i.pinimg.com/1200x/57/9c/3f/579c3ffe03abb02f013b27985bb3ca67.jpg",
          likes: 2450,
          comments: 189,
          shares: 560,
          details:
            "Cristiano Ronaldo scored twice as Al-Nassr secured their third Saudi Super Cup title in front of 60,000 fans at King Fahd Stadium. The victory marks a successful start to 2026 for the Riyadh-based club.",
        },
        {
          id: 2,
          title: "New $500M Al-Nassr Stadium Announced",
          description:
            "Club reveals plans for a state-of-the-art 70,000 capacity stadium to be completed by 2028.",
          date: "January 28, 2026",
          category: "Infrastructure",
          imageUrl:
            "https://i.pinimg.com/1200x/b5/81/c7/b581c7252d18652abd3ff26b54105b87.jpg",
          likes: 3200,
          comments: 245,
          shares: 890,
          details:
            "Al-Nassr FC has announced construction of 'Al-Nassr Arena', a world-class stadium featuring retractable roof, premium hospitality areas, and cutting-edge fan experience technology.",
        },
        {
          id: 3,
          title: "Ronaldo Breaks Saudi League Scoring Record",
          description:
            "CR7 becomes all-time top scorer in Saudi Pro League history with 45 goals in a single season.",
          date: "January 25, 2026",
          category: "Record Broken",
          imageUrl:
            "https://i.pinimg.com/736x/67/db/87/67db871c34610b1743b0036369991350.jpg",
          likes: 5500,
          comments: 423,
          shares: 1250,
          details:
            "Cristiano Ronaldo continues to rewrite history, breaking the Saudi Pro League scoring record previously held by Abderrazak Hamdallah. The Portuguese star reached 45 goals in just 28 appearances.",
        },
      ];
      setAlNassrNews(news);
    } catch (error) {
      console.error("Error fetching news:", error);
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

  const maxIndex = Math.max(0, alNassrNews.length - itemsPerView);
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

  const visibleNews = alNassrNews.slice(
    currentIndex,
    currentIndex + itemsPerView,
  );

  const handleConvertPrize = (prize) => {
    setSelectedPrizeForAction(prize);
    setShowConvertModal(true);
  };

  const handleClaimPrize = (prize) => {
    setSelectedPrizeForAction(prize);
    setShowClaimModal(true);
  };

  const confirmConvertPrize = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      // Calculate conversion amount (USD value / 100)
      const marketValueUSD = selectedPrizeForAction.marketValueUSD.replace(
        /[^\d.-]/g,
        "",
      );
      const convertAmount = parseFloat(marketValueUSD) / conversionRate;

      const response = await axios.post(`${Api}/convert`, {
        token,
        prizeId: selectedPrizeForAction.prizeId,
        userId: userData._id,
        convertAmount: convertAmount,
        prizeDetails: selectedPrizeForAction,
      });

      if (response.data.success) {
        toast.success(
          `Prize converted successfully! $${convertAmount.toFixed(2)} added to your balance.`,
        );
        fetchUserData(); // Refresh user data
        setShowConvertModal(false);
        setSelectedPrizeForAction(null);
      }
    } catch (error) {
      console.error("Convert prize error:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to convert prize";
      toast.error(errorMessage);
    }
  };

  const confirmClaimPrize = () => {
    if (!selectedPrizeForAction || !userData) return;

    // Create WhatsApp message template
    const whatsappMessage = `*🎉 PRIZE CLAIM REQUEST 🎉*

*Customer Information:*
👤 Name: ${userData.firstname} ${userData.lastname}
📧 Email: ${userData.email}
📱 User ID: ${userData._id}

*Prize Details:*
🏆 Prize: ${selectedPrizeForAction.title}
🚚 Shipping Fee: ${selectedPrizeForAction.shippingFeeSAR} ($${selectedPrizeForAction.shippingFeeUSD})

Please give me more informations to redeem my prize`;

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappNumber = "+1 (825) 595-3700"; // Replace with actual business WhatsApp number

    // Open WhatsApp with the message
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      "_blank",
    );

    toast.success(
      "Opening WhatsApp to complete your claim. Please provide your shipping details.",
    );
    setShowClaimModal(false);
    setSelectedPrizeForAction(null);
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

      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-800/30 to-blue-900/20 rounded-xl p-4 border border-blue-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Your Points</p>
                <p className="text-xl font-bold text-white">{userPoints}</p>
              </div>
              <FaCoins className="text-yellow-400 text-lg" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">Active Prizes</p>
                <p className="text-xl font-bold text-white">
                  {userPrizes.filter((p) => p.isActive).length}
                </p>
              </div>
              <FaTrophy className="text-yellow-400 text-lg" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-800/30 to-emerald-900/20 rounded-xl p-4 border border-emerald-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm">Pending Draws</p>
                <p className="text-xl font-bold text-white">
                  {userPrizes.filter((p) => !p.isActive).length}
                </p>
              </div>
              <FaClock className="text-yellow-400 text-lg" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-800/30 to-purple-900/20 rounded-xl p-4 border border-purple-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Value</p>
                <p className="text-xl font-bold text-white">
                  SAR{" "}
                  {userPrizes
                    .reduce((acc, prize) => {
                      const value =
                        parseFloat(
                          prize.marketValueSAR.replace(/[^\d.-]/g, ""),
                        ) || 0;
                      return acc + value;
                    }, 0)
                    .toLocaleString()}
                </p>
              </div>
              <FaDollarSign className="text-yellow-400 text-lg" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Al-Nassr News Carousel Section */}
      <div className="relative mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <FaNewspaper className="mr-3 text-yellow-400" />
            Latest Al-Nassr News
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-800/80 to-blue-900/80 border border-blue-700/50 flex items-center justify-center text-white hover:text-yellow-400 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
              aria-label="Previous slide"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-800/80 to-blue-900/80 border border-blue-700/50 flex items-center justify-center text-white hover:text-yellow-400 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
              aria-label="Next slide"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* News Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleNews.map((news) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="h-full"
              >
                {/* News Card */}
                <div className="h-full bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-700/50 rounded-3xl p-6 backdrop-blur-sm hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 overflow-hidden">
                  {/* News Image */}
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-full">
                        {news.category}
                      </span>
                    </div>
                  </div>

                  {/* News Content */}
                  <div>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <FaCalendar className="mr-2" />
                      {news.date}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 hover:text-yellow-400 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                      {news.description}
                    </p>

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <FaHeart className="text-red-400" />
                          <span>{news.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaComment className="text-blue-400" />
                          <span>{news.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaShareAlt className="text-green-400" />
                          <span>{news.shares}</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
      </div>

      {/* Your Prizes Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaTrophy className="mr-3 text-yellow-400" />
          Your Prizes ({userPrizes.length})
        </h2>

        {userPrizes.length === 0 ? (
          <div className="text-center py-12">
            <FaTrophy className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              No Prizes Yet
            </h3>
            <p className="text-gray-500">
              Enter giveaways to win amazing prizes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPrizes.map((prize) => (
              <motion.div
                key={prize.prizeId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-700/50 rounded-3xl p-6 backdrop-blur-sm hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 overflow-hidden"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-20">
                  {prize.isActive ? (
                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full flex items-center">
                      <FaCheck className="mr-1" /> Winner!
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold rounded-full flex items-center">
                      <FaClock className="mr-1" /> Draw Pending
                    </span>
                  )}
                </div>

                {/* Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 bg-gradient-to-br ${prize.color?.split(" ").slice(0, 2).join(" ") || "from-gray-700 to-gray-900"} text-white text-xs font-bold rounded-full`}
                    >
                      {prize.badge || "Prize"}
                    </span>
                  </div>
                </div>

                {/* Prize Image */}
                <div className="relative mb-6 mt-10">
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden">
                    <img
                      src={prize.imageUrl}
                      alt={prize.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Collector Grade */}
                  {prize.collectorGrade && (
                    <div className="absolute -bottom-3 right-4">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-gray-900 to-gray-800 border border-yellow-500/30 rounded-lg shadow-lg">
                        <div className="text-xs text-gray-400">Grade</div>
                        <div className="text-base font-bold text-yellow-400">
                          {prize.collectorGrade}
                        </div>
                      </div>
                    </div>
                  )}
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
                      <div className="text-xs text-gray-400">Market Value</div>
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

                  {/* Shipping Info */}
                  {prize.shippingFeeUSD > 0 && (
                    <div className="mb-4 p-3 bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-xl border border-amber-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <FaShippingFast className="text-amber-400" />
                          <span className="text-amber-300 font-semibold">
                            Shipping Fee
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">USD</div>
                          <div className="text-lg font-bold text-white">
                            ${prize.shippingFeeUSD}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">SAR</div>
                          <div className="text-lg font-bold text-white">
                            {prize.shippingFeeSAR}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {prize.features && prize.features.length > 0 && (
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
                  )}
                </div>

                {/* Action Buttons */}
                {prize.isActive ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleConvertPrize(prize)}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <FaExchangeAlt />
                      <span>Convert to Cash</span>
                    </button>
                    <button
                      onClick={() => handleClaimPrize(prize)}
                      className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <FaTruck />
                      <span>Claim Prize</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/20 rounded-xl border border-blue-700/30">
                    <div className="flex items-center space-x-3">
                      <FaClock className="text-blue-400" />
                      <div>
                        <p className="font-bold text-blue-300">
                          Draw in Progress
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Convert Prize Modal */}
      <AnimatePresence>
        {showConvertModal && selectedPrizeForAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowConvertModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl w-full max-w-md overflow-hidden border border-emerald-700/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-emerald-700/50 bg-gradient-to-r from-emerald-900/50 to-emerald-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-lg">
                      <FaExchangeAlt className="text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Convert Prize to Cash
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Exchange your prize for USD value
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowConvertModal(false)}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Prize Info */}
                <div className="mb-6 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/30 rounded-xl border border-gray-700/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={selectedPrizeForAction.imageUrl}
                      alt={selectedPrizeForAction.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm">
                        {selectedPrizeForAction.title}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {selectedPrizeForAction.category}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-400">Market Value</div>
                      <div className="text-sm font-bold text-white">
                        {selectedPrizeForAction.marketValueUSD}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversion Details */}
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-900/20 to-emerald-800/10 rounded-xl border border-emerald-700/30">
                  <h4 className="font-bold text-emerald-300 mb-3">
                    Conversion Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">USD Market Value:</span>
                      <span className="font-bold text-white">
                        {selectedPrizeForAction.marketValueUSD}
                      </span>
                    </div>
                    <div className="h-px bg-emerald-700/30 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">
                        You Receive:
                      </span>
                      <span className="text-2xl font-bold text-emerald-400">
                        $
                        {(
                          parseFloat(
                            selectedPrizeForAction.marketValueUSD.replace(
                              /[^\d.-]/g,
                              "",
                            ),
                          ) / conversionRate
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Important Note */}
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 rounded-xl border border-yellow-700/30">
                  <div className="flex items-start space-x-3">
                    <FaInfoCircle className="text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-yellow-300 mb-1">
                        Important Note
                      </h4>
                      <p className="text-sm text-yellow-100">
                        Once converted, this prize will be permanently removed
                        from your account and the cash amount will be added to
                        your balance immediately.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConvertModal(false)}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-all duration-300 border border-gray-700/50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmConvertPrize}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <FaExchangeAlt />
                    <span>Convert Now</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claim Prize Modal */}
      <AnimatePresence>
        {showClaimModal && selectedPrizeForAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowClaimModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl w-full max-w-md overflow-hidden border border-yellow-700/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-yellow-700/50 bg-gradient-to-r from-yellow-900/50 to-yellow-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-lg">
                      <FaTruck className="text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Claim Your Prize
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Complete shipping process via WhatsApp
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Prize Info */}
                <div className="mb-6 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/30 rounded-xl border border-gray-700/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={selectedPrizeForAction.imageUrl}
                      alt={selectedPrizeForAction.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm">
                        {selectedPrizeForAction.title}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {selectedPrizeForAction.category}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Market Value:</span>
                      <span className="font-bold text-white">
                        {selectedPrizeForAction.marketValueSAR}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Shipping Fee:</span>
                      <span className="font-bold text-yellow-400">
                        {selectedPrizeForAction.shippingFeeSAR}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/10 rounded-xl border border-blue-700/30">
                  <h4 className="font-bold text-blue-300 mb-3">
                    Shipping Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
                      <p className="text-sm text-blue-100">
                        You will be redirected to WhatsApp to provide your
                        shipping details. Our team will contact you within 24
                        hours.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <FaShippingFast className="text-yellow-400 mt-1 flex-shrink-0" />
                      <p className="text-sm text-yellow-100">
                        Shipping fee must be paid before dispatch. Delivery
                        takes 5-7 business days.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Required Information */}
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-900/20 to-emerald-800/10 rounded-xl border border-emerald-700/30">
                  <h4 className="font-bold text-emerald-300 mb-2">
                    You Need to Provide:
                  </h4>
                  <ul className="text-sm text-emerald-100 space-y-1">
                    <li>• Full name as per ID</li>
                    <li>• Complete shipping address</li>
                    <li>• Contact phone number</li>
                    <li>• Email address for tracking</li>
                    <li>• Preferred delivery time</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-all duration-300 border border-gray-700/50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmClaimPrize}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Continue</span>
                  </button>
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
