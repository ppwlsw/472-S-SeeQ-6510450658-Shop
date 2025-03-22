import React from "react";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface LoadingIndicatorProps {
  /**
   * Lucide icon component to display
   * If not provided, will show a loading spinner
   */
  icon?: LucideIcon;

  /**
   * Message to display under the icon
   */
  message: string;

  /**
   * Is the component in loading state or finished state
   */
  isLoading?: boolean;

  /**
   * Icon color when not in loading state
   */
  iconColor?: string;

  /**
   * Text color when not in loading state
   */
  textColor?: string;

  /**
   * Optional onClick handler
   */
  onClick?: () => void;

  /**
   * Optional additional CSS classes
   */
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  icon: Icon,
  message,
  isLoading = true,
  iconColor = "#F44336",
  textColor = "#0b1215",
  onClick,
  className = "",
}) => {
  return (
    <motion.div
      className={`flex flex-col justify-center items-center gap-3 rounded-lg bg-white-smoke p-6 ${className}`}
      onClick={onClick}
    >
      {isLoading ? (
        <span className="inline-block  border-4 border-gray-400 rounded-full border-t-white-smoke animate-spin"></span>
      ) : Icon ? (
        <motion.div
          initial={{ rotate: 90 }}
          animate={{
            rotate: 0,
            transition: { duration: 0.3, ease: "easeIn" },
          }}
        >
          <Icon size={36} color={iconColor} />
        </motion.div>
      ) : null}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          color: isLoading ? textColor : iconColor,
          transition: { duration: 0.3, ease: "easeIn" },
        }}
        className="text-xl text-center"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default LoadingIndicator;
