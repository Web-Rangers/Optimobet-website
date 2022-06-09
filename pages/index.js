import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/pages/Home.module.css'

import { SwiperSlide } from 'swiper/react';
import SliderWithControls from '../components/SliderWithControls'

import PromoBlock from '../components/PromoBlock';
import SiteCard from '../components/SiteCard';
import CategoryBlock from '../components/CategoryBlock';

export default function Home() {

	return (
		<div className={styles.container}>
			<Head>
				<title>OPTIMOBET</title>
				<meta name="description" content="OPTIMOBET WEBSITE" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<div className={styles.mainSlider}>
					<SliderWithControls>
						{[1,2,3].map(item => (
							<SwiperSlide className={styles.sliderBlock}>
								<div>
									<Image
										className={styles.sliderPicture}
										src="/placeholder.png"
										layout='fill'
										objectFit='cover'
									/>
								</div>
							</SwiperSlide>
						))}
					</SliderWithControls>
				</div>

				<div className={styles.categoryBlocks}>
					<CategoryBlock />
					<CategoryBlock />
					<CategoryBlock />
					<CategoryBlock />
				</div>

				<div className={styles.promoBlocks}>
					<div className={styles.BlocksHeader}>
						<span className={styles.promoBlocksSubTitle}>
							subtitle
						</span>
						<span className={styles.promoBlocksTitle}>
							title
						</span>
					</div>
					<div className={styles.promoBlocksContent}>
						<PromoBlock />
						<PromoBlock />
					</div>
				</div>

				<div className={styles.sitesGallery}>
					<SiteCard rep={1} />
					<SiteCard rep={56} />
					<SiteCard rep={78} />
					<PromoBlock />
					<SiteCard rep={99} />
					<SiteCard rep={56} />
					<SiteCard rep={78} />
					<SiteCard rep={99} />
					<div className={styles.moreButtonArea}>
						<a
							className={styles.moreButton}
						>
							See More
						</a>
					</div>
				</div>

				<div className={styles.sitesLine}>
					<div className={styles.BlocksHeader}>
						<span className={styles.promoBlocksSubTitle}>
							subtitle
						</span>
						<span className={styles.promoBlocksTitle}>
							title
						</span>
					</div>
					<SiteCard rep={56} />
					<SiteCard rep={78} />
					<SiteCard rep={99} />
					<div className={styles.moreButtonArea} style={{marginTop:"24px"}}>
						<a
							className={styles.moreButton}
						>
							See More
						</a>
					</div>
				</div>

				<div className={styles.promoBlocks}>
					<div className={styles.BlocksHeader}>
						<span className={styles.promoBlocksSubTitle}>
							subtitle
						</span>
						<span className={styles.promoBlocksTitle}>
							title
						</span>
					</div>
					<div className={styles.promoBlocksContent}>
						<PromoBlock />
						<PromoBlock />
					</div>
				</div>

				<div className={styles.slotsSlider}>
					<div className={styles.headerBlockWrap}>
						<div className={styles.BlocksHeader}>
							<span className={styles.promoBlocksSubTitle}>
								subtitle
							</span>
							<span className={styles.promoBlocksTitle}>
								title
							</span>
						</div>
					</div>
					<SliderWithControls>
						{[1,1,1,1,1,1].map(item => (
							<SwiperSlide className={styles.slotBlock}>
								<div>
									<Image
										className={styles.sliderPicture}
										src="/placeholder.png"
										layout='fill'
										objectFit='cover'
									/>
								</div>
								<div>
									<Image
										className={styles.sliderPicture}
										src="/placeholder.png"
										layout='fill'
										objectFit='cover'
									/>
								</div>
								<div>
									<Image
										className={styles.sliderPicture}
										src="/placeholder.png"
										layout='fill'
										objectFit='cover'
									/>
								</div>
								<div>
									<Image
										className={styles.sliderPicture}
										src="/placeholder.png"
										layout='fill'
										objectFit='cover'
									/>
								</div>
							</SwiperSlide>
						))}
					</SliderWithControls>
				</div>

				
			</main>
		</div>
	)
}
