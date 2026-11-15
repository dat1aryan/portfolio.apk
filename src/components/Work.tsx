import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const base = import.meta.env.BASE_URL;

const projects = [
  {
    title: "BreadBuddy",
    category: "Gen-Z Personal Finance Tracker · Local-First Web Application",
    tools: "React, Local-First Architecture, Expense Tracking, Budgeting & Financial Analytics",
    image: `${base}images/breadbuddy.png`,
    link: "https://github.com/dat1aryan/Breadbuddy",
  },
  {
    title: "Neuro Vision (now MindSphere)",
    category: "AI-Powered Neurological Analysis Platform · 1st Place, Protosphere 2025 · Deployed",
    tools: "Deep Learning, MRI-Based Brain Tumor Detection, Cognitive Assessment, Explainable AI, Grad-CAM",
    image: `${base}images/neuro-vision.png`,
    link: "https://www.neuro-vision.me/",
  },
  {
    title: "MakeWise",
    category: "Manufacturing Decision Engine · ANVESHAN 2026 Prototype",
    tools: "FastAPI, React, FDM 3D Printing vs CNC vs Injection Moulding, Cost Modelling, Carbon Emissions & Break-Even Analysis",
    image: `${base}images/makewise.png`,
    link: "https://github.com/dat1aryan/MakeWise",
  },
  {
    title: "QUREX (SIH26139)",
    category: "Hybrid Quantum Machine Learning for Early Breast Cancer Detection · SIH 2026 Prototype",
    tools: "Hybrid Quantum-Classical ML, CBIS-DDSM Mammography Dataset, Lesion ROI Analysis, Pixel-Level Segmentation Masks",
    image: `${base}images/qurex.png`,
    link: "https://drive.google.com/file/d/1q6AyvpRgoI6dXksaGNlUI_GsJgmtrHiM/view?usp=sharing",
  },
  {
    title: "Vizent",
    category: "AI Analytics Copilot · ByteBuilt 2.0 Hackathon · Concept",
    tools: "React, Tailwind CSS, Plotly, Apache ECharts, FastAPI, Pandas, NumPy, SciPy, Gemini API & Firebase Authentication",
    image: `${base}images/Vizent.png`,
    link: "https://drive.google.com/file/d/1qBema5hBhn799oiB0sTnotFFvjQCD8WV/view?usp=sharing",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage
                        image={project.image}
                        alt={project.title}
                        link={project.link}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
