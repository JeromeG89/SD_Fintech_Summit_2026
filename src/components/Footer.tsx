import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
		<footer className="bg-indigo-900 text-white py-4">
			<div className="w-full mx-auto px- flex flex-col lg:flex-row justify-center lg:justify-evenly items-center space-y-4 lg:space-y-0">
				{/* Social Media Icons */}
				<div className="flex justify-center space-x-6 items-center h-12">
					<div className="flex items-center cursor-pointer">
						{/* Summit Logo */}
						<Link href="/" passHref>
							<Image
								className="" // Reduced margin-left
								alt="logo"
								src="/HomeLogoFull.png"
								width={80} // Adjust dimensions if necessary
								height={50}
							/>
						</Link>
					</div>
					<a
						href="https://t.me/+I-SUnalMtPE4NzE1"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Telegram"
					>
						<img
							src="/icons/telegram.svg"
							alt="Telegram"
							className="h-6 hover:opacity-60"
						/>
					</a>
					{/* Divider Line */}
					<div className="w-px h-8 bg-white mx-1" />{" "}
					{/* Reduced margin-left and margin-right */}
					{/* FTS Logo */}
					<div className="flex items-center cursor-pointer">
						<a
							href="https://fintechsociety.comp.nus.edu.sg"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="NUS Fintech Society"
						>
							<Image
								className="" // Reduced margin-right
								alt="logo"
								src="/navbar-logo.png"
								width={80} // Adjust dimensions if necessary
								height={50}
							/>
						</a>
					</div>
					<a
						href="https://www.linkedin.com/company/nus-fintech-society"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="LinkedIn"
					>
						<img
							src="/icons/linkedin.svg"
							alt="LinkedIn"
							className="h-6 hover:opacity-60"
						/>
					</a>
					<a
						href="https://www.instagram.com/nusfintech"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram"
					>
						<img
							src="/icons/instagram.svg"
							alt="Instagram"
							className="h-7 hover:opacity-60"
						/>
					</a>
					<a
						href="https://t.me/nusfintechpublic"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Telegram"
					>
						<img
							src="/icons/telegram.svg"
							alt="Telegram"
							className="h-6 hover:opacity-60"
						/>
					</a>
				</div>

				<div className="flex flex-col lg:flex-row items-center lg:space-y-0">
					{/* Copyright Text */}
					<div className="">Copyright &copy; 2024 - Present</div>
					<div className="hidden lg:block">, &nbsp;</div>
					<div>NUS FinTech Society. &nbsp;</div>
					<div className="">All Rights Reserved.</div>
				</div>
			</div>
		</footer>
  );
};

export default Footer;
