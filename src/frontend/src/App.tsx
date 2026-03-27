import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Camera, LogIn, LogOut, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPanel } from "./components/AdminPanel";
import { Lightbox } from "./components/Lightbox";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetAllPhotos, useIsCallerAdmin } from "./hooks/useQueries";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];
const SKELETON_HEIGHTS = [200, 280, 240, 320, 200, 260, 280, 200];

export default function App() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const [showAdmin, setShowAdmin] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: photos = [], isLoading: photosLoading } = useGetAllPhotos();
  const { data: isAdmin } = useIsCallerAdmin();

  const handleLogin = async () => {
    try {
      await login();
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    clear();
    setShowAdmin(false);
    toast.success("Logged out successfully.");
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPhoto = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + photos.length) % photos.length : null,
    );
  const nextPhoto = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null));

  return (
    <div className="min-h-screen bg-background font-body">
      <Toaster position="top-right" />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-4 bg-hero/95 backdrop-blur-sm border-b border-white/10">
        <span className="font-display text-lg font-semibold text-hero-foreground tracking-widest uppercase">
          Tisha Modi
        </span>
        <nav className="flex items-center gap-3">
          {isAdmin && isLoggedIn && (
            <Button
              data-ocid="nav.admin_panel.button"
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setShowAdmin((s) => !s)}
            >
              <Settings className="w-4 h-4 mr-1.5" />
              {showAdmin ? "Gallery" : "Admin"}
            </Button>
          )}
          {!isLoggedIn ? (
            <Button
              data-ocid="nav.login.button"
              variant="outline"
              size="sm"
              className="border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white"
              onClick={handleLogin}
              disabled={isLoggingIn || isInitializing}
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full border-2 border-white/60 border-t-transparent animate-spin" />
                  Logging in...
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Login
                </>
              )}
            </Button>
          ) : (
            <Button
              data-ocid="nav.logout.button"
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Logout
            </Button>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ background: "oklch(var(--hero-bg))" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-tisha-modi.dim_1920x1080.jpg')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 60%, oklch(var(--hero-bg)) 100%)",
          }}
        />

        <motion.div
          className="relative z-10 flex flex-col items-center gap-6 px-4"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-12 bg-white/40" />
            <Camera className="w-4 h-4 text-white/60" />
            <div className="h-px w-12 bg-white/40" />
          </div>
          <h1
            className="font-display font-bold text-hero-foreground"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              letterSpacing: "0.15em",
              lineHeight: 1,
            }}
          >
            TISHA MODI
          </h1>
          <motion.p
            className="font-body text-white/60 tracking-[0.3em] uppercase text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Photography &nbsp;/&nbsp; Portfolio
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <a
              href="#gallery"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm tracking-widest uppercase font-body"
            >
              <span>View Gallery</span>
              <span className="animate-bounce text-lg">↓</span>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Main Content */}
      <main>
        <AnimatePresence mode="wait">
          {showAdmin && isAdmin ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel />
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Gallery Section */}
              <section
                id="gallery"
                className="py-20 px-4 md:px-8 max-w-screen-2xl mx-auto"
              >
                <motion.div
                  className="text-center mb-14"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-muted-foreground tracking-[0.3em] uppercase text-xs mb-3 font-body">
                    Collection
                  </p>
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                    Photo Gallery
                  </h2>
                  <div className="mt-4 mx-auto w-16 h-0.5 bg-foreground/20 rounded-full" />
                </motion.div>

                {photosLoading ? (
                  <div
                    data-ocid="gallery.loading_state"
                    className="masonry-grid"
                  >
                    {SKELETON_KEYS.map((key, i) => (
                      <div key={key} className="masonry-item">
                        <Skeleton
                          className="w-full rounded-lg"
                          style={{ height: `${SKELETON_HEIGHTS[i]}px` }}
                        />
                      </div>
                    ))}
                  </div>
                ) : photos.length === 0 ? (
                  <motion.div
                    data-ocid="gallery.empty_state"
                    className="flex flex-col items-center justify-center py-32 gap-6"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <Camera className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                        Gallery Coming Soon
                      </h3>
                      <p className="text-muted-foreground font-body max-w-sm">
                        Beautiful moments are being curated. Check back soon to
                        explore the collection.
                      </p>
                    </div>
                    {!isLoggedIn && (
                      <Button
                        data-ocid="gallery.login.button"
                        variant="outline"
                        onClick={handleLogin}
                        className="mt-2"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Admin Login
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  <div className="masonry-grid">
                    {photos.map((photo, i) => (
                      <motion.div
                        data-ocid={`gallery.item.${i + 1}`}
                        key={photo.title}
                        className="masonry-item group relative cursor-pointer overflow-hidden rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                        onClick={() => openLightbox(i)}
                      >
                        <img
                          src={photo.blob.getDirectURL()}
                          alt={photo.title}
                          loading="lazy"
                          className="w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 rounded-lg flex items-end">
                          <div className="w-full p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <p className="text-white font-body text-sm tracking-widest uppercase truncate">
                              {photo.title}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Lightbox */}
      <Lightbox
        photos={photos}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevPhoto}
        onNext={nextPhoto}
      />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border text-center">
        <p className="text-muted-foreground text-sm font-body">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
