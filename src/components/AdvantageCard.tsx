import React from 'react';
import styled from 'styled-components';

interface AdvantageCardProps {
  title: string;
  description: string;
  gradient: string;
  icon: React.ReactNode;
  shadowColor: string;
  imageUrl: string;
}

export default function AdvantageCard({
  title,
  description,
  gradient,
  icon,
  shadowColor,
  imageUrl
}: AdvantageCardProps) {
  return (
    <StyledWrapper $gradient={gradient} $shadowColor={shadowColor} $imageUrl={imageUrl}>
      <div className="card">
        <div className="top-section">
          <div className="card-bg-image" />
          <div className="border" />
          <div className="icons">
            <div className="logo">
              {icon}
            </div>
          </div>
        </div>
        <div className="bottom-section">
          <span className="title">{title}</span>
          <div className="row row1">
            <div className="item">
              <span className="big-text">{description}</span>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

interface StyledWrapperProps {
  $gradient: string;
  $shadowColor: string;
  $imageUrl: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  display: flex;
  justify-content: center;
  width: 100%;

  .card {
    width: 100%;
    max-width: 340px;
    border-radius: 20px;
    background: #1b233d;
    padding: 5px;
    overflow: hidden;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 20px 0px;
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease;
    border: 1px solid rgba(255, 255, 255, 0.04);
  }

  .card:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: ${props => props.$shadowColor} 0px 15px 35px 0px;
    border-color: rgba(255, 255, 255, 0.12);
  }

  .card .top-section {
    height: 150px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    background: #111827;
    position: relative;
    overflow: hidden;
  }

  /* Background Image styling */
  .card .top-section .card-bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.$imageUrl});
    background-size: cover;
    background-position: center;
    opacity: 0.7;
    transition: opacity 0.5s ease, transform 0.5s ease;
    pointer-events: none;
    z-index: 1;
  }

  .card:hover .top-section .card-bg-image {
    transform: scale(1.1);
    opacity: 0.9;
  }

  /* Shimmer / light sweep effect on top section on hover */
  .card .top-section::after {
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.25),
      transparent
    );
    transform: skewX(-20deg);
    transition: 0.75s;
    opacity: 0;
    pointer-events: none;
    z-index: 2;
  }

  .card:hover .top-section::after {
    left: 120%;
    opacity: 1;
    transition: all 0.8s ease-in-out;
  }

  .card .top-section .border {
    border-bottom-right-radius: 10px;
    height: 30px;
    width: 130px;
    background: #1b233d;
    position: relative;
    transform: skew(-40deg);
    box-shadow: -10px -10px 0 0 #1b233d;
    z-index: 3;
  }

  .card .top-section .border::before {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    top: 0;
    right: -15px;
    background: rgba(255, 255, 255, 0);
    border-top-left-radius: 10px;
    box-shadow: -5px -5px 0 2px #1b233d;
  }

  .card .top-section::before {
    content: "";
    position: absolute;
    top: 30px;
    left: 0;
    background: rgba(255, 255, 255, 0);
    height: 15px;
    width: 15px;
    border-top-left-radius: 15px;
    box-shadow: -5px -5px 0 2px #1b233d;
    z-index: 3;
  }

  .card .top-section .icons {
    position: absolute;
    top: 0;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    z-index: 4;
  }

  .card .top-section .icons .logo {
    height: 100%;
    aspect-ratio: 1;
    padding: 7px 0 7px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .card .bottom-section {
    margin-top: 15px;
    padding: 10px 12px;
  }

  .card .bottom-section .title {
    display: block;
    font-size: 17px;
    font-weight: bolder;
    color: white;
    text-align: center;
    letter-spacing: 2px;
    font-family: var(--font-display);
    transition: color 0.3s ease;
  }

  .card:hover .bottom-section .title {
    color: #ffffff;
  }

  .card .bottom-section .row {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .card .bottom-section .row .item {
    flex: 100%;
    text-align: center;
    padding: 5px;
    color: rgba(170, 222, 243, 0.72);
    line-height: 1.6;
  }

  .card .bottom-section .row .item .big-text {
    font-size: 13px;
    display: block;
    transition: color 0.3s ease;
  }

  .card:hover .bottom-section .row .item .big-text {
    color: rgba(255, 255, 255, 0.9);
  }
`;
