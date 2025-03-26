import React from 'react';
import projectImg from '../assets/project.jpg';

const ProjectSection: React.FC = () => {
  return (
    <section className="py-10 border-t">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-xl font-normal mb-8">Latest Project</h2>

        <div className="border rounded-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <img
                src={projectImg}
                alt="Latest Project - Final Frontier"
                className="w-full h-auto"
              />
            </div>

            <div className="col-span-2 flex flex-col">
              <div className="mb-4">
                <p className="text-sm text-muted mb-2">Art Direction, UI/UX, Motion, 2023</p>
                <h3 className="text-xl mb-1">FINAL FRONTIER: RESILIENCE</h3>
                <h3 className="text-xl">OF RUIN</h3>
              </div>

              <div className="mt-auto">
                <button className="rounded-full border border-black py-2 px-6 text-xs hover:bg-black hover:text-white transition-colors duration-300">
                  VIEW CASE
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <p className="text-sm text-muted">Use menu to explore</p>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
