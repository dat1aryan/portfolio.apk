import ShimmerText from "./ui/shimmer-text";
import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <div className="about-quote-wrap">
          <ShimmerText
            className="about-quote-shimmer"
            duration={2.2}
            delay={0.4}
          >
            Talent without hard work is nothing.
          </ShimmerText>
        </div>
        <p className="para">
          Currently an undergraduate in Computer Science and Engineering,
          specialising in Artificial Intelligence at Shoolini University.
          Interested in AI/ML, full-stack and cloud development, and research in
          Medical AI and Quantum Machine Learning.
        </p>
        <p className="para">
          Outside academics, I&apos;m a passionate gamer, an acoustic guitar
          enthusiast, and someone who finds joy in the little things.
        </p>
      </div>
    </div>
  );
};

export default About;
