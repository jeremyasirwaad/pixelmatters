import React, { useState, useEffect } from "react";
import { Minibeamscard } from "../../models/Minibeamcard/Minibeamscard";
import microbeambgheroimg from "../../assets/microbeamheroimg.png";
import { AiOutlineSearch, AiFillCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Popup } from "../../models/Popup/Popup";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import { BeatLoader } from "react-spinners";
import { API } from "../../constants";
import { Popupnotes } from "../../models/Popupnotes/Popupnotes";
import { Maxbeamscard } from "../../models/Maxbeamscard/Maxbeamscard";
import { GotoTop } from "../../models/GotoTop/GotoTop";
import ShareModel from "../../models/ShareModel/ShareModel";
import { FirstHighlightPopUp } from "../../models/FirstHighlightPopUp/FirstHightlightPopUp";

export const Minibeams = () => {
	const [modelopen, setModelopen] = useState(false);

	const [scrollercontrol, setscrollercontrol] = useState(0);
	const navigate = useNavigate();
	const [maxbeams, setMaxbeams] = useState([]);
	const [maxbeamsload, setMaxbeamsload] = useState([]);
	const [trendingmicrobeams, setTrendingMicrobeams] = useState([]);
	const [Launchoftheweekmicrobeams, setLauchoftheweekMicrobeams] = useState([]);
	const [microbeams, setMicrobeams] = useState([]);
	const [microbeamsload, setMicrobeamsload] = useState(false);
	const [popuptitle, setPopuptitle] = useState("");
	const [popupcontent, setPopupcontent] = useState("");
	const [suggestion, setSuggestion] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [opensuggestionBox, setOpensuggestionBox] = useState(false);
	const [forceclose, setforceclose] = useState(false);
	const [searchOptionType, setSearchOptionType] = useState(0);
	const [notesPopup, setNotesPopup] = useState(false);
	const [notepopupdata, setNotepopupdata] = useState({});
	const [popupid, setPopupid] = useState(0);
	const [popuptype, setPopuptype] = useState("");
	const [sharemodelstaus, setSharemodelstaus] = useState(false);

	const closesharemodel = () => setSharemodelstaus(false);

	const opensharemodel = () => setSharemodelstaus(true);
	const { token, firsthightlight, setFirsthightlight } = useAuthContext();

	const close = () => setModelopen(false);
	const open = (title, content, id, type) => {
		setPopupcontent(content);
		setPopuptitle(title);
		setModelopen(true);
		setPopupid(id);
		setPopuptype(type);
	};

	const opennotePopup = (data) => {
		setNotepopupdata(data);
		setNotesPopup(true);
	};

	const closenotePopup = () => setNotesPopup(false);

	const fetchdata = async () => {
		setMicrobeamsload(true);
		const data = await fetch(`${API}/microbeams`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
			.then((res) => res.json())
			.then((e) => {
				const data = e.data;
				setMicrobeams(e.data);
				const trending = data.filter((micro) => {
					return micro.attributes.type === "Trending";
				});
				const launchoftheweek = data.filter((micro) => {
					return micro.attributes.type === "Launchoftheweek";
				});
				setTrendingMicrobeams(trending);
				setLauchoftheweekMicrobeams(launchoftheweek);
				setMicrobeamsload(false);
			});
	};

	const fetchdata2 = async () => {
		setMaxbeamsload(true);
		const data = await fetch(`${API}/minibeams`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
			.then((res) => res.json())
			.then((e) => {
				setMaxbeams(e.data);
				setMaxbeamsload(false);
			});
	};

	useEffect(() => {
		setSuggestion([]);

		fetchdata();
		fetchdata2();
	}, []);

	return (
		<div>
			<GotoTop />
			{modelopen && (
				<Popup
					content={popupcontent}
					title={popuptitle}
					handleClose={close}
					id={popupid}
					openNotes={opennotePopup}
					type={popuptype}
				></Popup>
			)}
			{notesPopup && (
				<Popupnotes
					data={notepopupdata}
					handleClose={closenotePopup}
				></Popupnotes>
			)}

			{sharemodelstaus && <ShareModel handleClose={closesharemodel} />}

			{firsthightlight && (
				<FirstHighlightPopUp
					handleClose={() => setFirsthightlight(false)}
				></FirstHighlightPopUp>
			)}

			<section className="minibeamspage">
				<section className="trendingbeamshero minibeamsbg">
					<img src={microbeambgheroimg} alt="" className="heroimgbeam" />
					<h1>
						Explore{" "}
						<span
							style={{
								backgroundColor: "#F7CD61",
								color: "black",
								padding: "10px",
								borderRadius: "10px"
							}}
						>
							The Future
						</span>{" "}
						With Micro Beams
					</h1>
				</section>
				<div className="innernav">
					<span>
						<span
							style={{ color: "#435CFF" }}
							onClick={() => {
								navigate("/");
							}}
						>
							Home
						</span>{" "}
						&nbsp; &gt; &nbsp;{" "}
						<span
							style={{ color: "#435CFF", cursor: "pointer" }}
							onClick={() => {
								navigate("/beams");
							}}
						>
							Beams
						</span>
						&nbsp; &gt; &nbsp;{" "}
						<span
							onClick={() => {
								navigate("/minibeams");
							}}
						>
							Microbeams
						</span>
					</span>
					<div className="searchbar">
						<input
							type="text"
							placeholder="Search"
							value={searchTerm}
							onChange={(e) => {
								setforceclose(true);
								setSearchTerm(e.target.value);
							}}
							onFocus={() => {
								setforceclose(true);
								setOpensuggestionBox(true);
							}}
						/>
						{searchTerm === "" && !forceclose ? (
							<AiOutlineSearch className="searchicon" />
						) : (
							<AiFillCloseCircle
								className="searchicon"
								color="black"
								onClick={() => {
									setSearchTerm("");
									setforceclose(false);
								}}
							/>
						)}
						{(searchTerm != "" || opensuggestionBox) && forceclose && (
							<div className="suggestionlist">
								{microbeams
									.filter((item) => {
										const searchterm = searchTerm.toLowerCase();
										const title = item.attributes.Title.toLowerCase();

										return title.includes(searchterm);
									})
									.map((item) => {
										return (
											<p
												style={{ paddingLeft: "20px", paddingRight: "20px" }}
												onClick={(e) => {
													e.stopPropagation();
													setSearchTerm(item.attributes.Title);
													setforceclose(false);
													setOpensuggestionBox(false);
												}}
											>
												{item.attributes.Title}
											</p>
										);
									})}
							</div>
						)}
					</div>
				</div>
				{searchTerm === "" ? (
					<div>
						<section className="minibeams">
							<div className="sec2label">
								<span>Launch Of The Week</span>
							</div>
							<div className="minicardcont">
								{Launchoftheweekmicrobeams.length !== 0 ? (
									<div className="minicardssection">
										{Launchoftheweekmicrobeams.map((micro) => {
											return (
												<Minibeamscard
													title={micro.attributes.Title}
													content={micro.attributes.Content}
													open={open}
													openNotes={opennotePopup}
													openshare={opensharemodel}
												/>
											);
										})}
									</div>
								) : (
									""
								)}
							</div>
						</section>
						<section className="minibeams">
							<div className="sec2label">
								<span>Trending</span>
							</div>
							<div className="minicardcontscroller">
								<FaChevronLeft
									style={{ cursor: "pointer" }}
									className="sliderarrows"
									size={22}
									onClick={() => {
										if (scrollercontrol != 0)
											setscrollercontrol(scrollercontrol - 560);
									}}
								/>
								<div className="minicardssectionscroller">
									<div
										className="minicardssectionscroller1"
										style={{
											position: "relative",
											right: `${scrollercontrol}px`
										}}
									>
										{trendingmicrobeams.map((micro) => {
											return (
												<Minibeamscard
													title={micro.attributes.Title}
													content={micro.attributes.Content}
													open={open}
													openNotes={opennotePopup}
													openshare={opensharemodel}
												/>
											);
										})}
									</div>
								</div>
								<FaChevronRight
									style={{ cursor: "pointer" }}
									className="sliderarrows"
									size={26}
									onClick={() => {
										console.log(trendingmicrobeams.length);
										if (scrollercontrol < 560 * (trendingmicrobeams.length - 1))
											setscrollercontrol(scrollercontrol + 560);
									}}
								/>
							</div>
							<div className="minicardsnaver"></div>
						</section>
						<section className="minibeams">
							<div className="sec2label">
								<span>Micro Beams</span>
							</div>
							<div className="minicardcont">
								{microbeams.length !== 0 ? (
									<div className="minicardssection">
										{microbeams.map((micro) => {
											return (
												<Minibeamscard
													title={micro.attributes.Title}
													content={micro.attributes.Content}
													open={open}
													openNotes={opennotePopup}
													openshare={opensharemodel}
												/>
											);
										})}
									</div>
								) : (
									""
								)}
							</div>
						</section>
					</div>
				) : (
					<div className="searchPage">
						<span className="searchPageheading">Search Results</span>
						<div className="searchPageoptions">
							<div className="searchPageoptions">
								<div className="searchpageleftoptions">
									<span
										onClick={() => {
											setSearchOptionType(0);
										}}
										style={{
											backgroundColor:
												searchOptionType == 0 ? "#F7CD61" : "#E3E3E3"
										}}
									>
										All
									</span>
									<span
										onClick={() => {
											setSearchOptionType(1);
										}}
										style={{
											backgroundColor:
												searchOptionType == 1 ? "#F7CD61" : "#E3E3E3"
										}}
									>
										Micro Beams
									</span>
									<span
										onClick={() => {
											setSearchOptionType(2);
										}}
										style={{
											backgroundColor:
												searchOptionType == 2 ? "#F7CD61" : "#E3E3E3"
										}}
									>
										Mini Beams
									</span>
								</div>
							</div>
						</div>
						<div className="minicardcont">
							{maxbeams.length !== 0 ? (
								<div className="minicardssection">
									{searchOptionType === 0 &&
										microbeams
											.filter((item) => {
												const searchterm = searchTerm.toLowerCase();
												const title = item.attributes.Title.toLowerCase();

												return title.includes(searchterm);
											})
											.map((micro) => {
												return (
													<Minibeamscard
														title={micro.attributes.Title}
														content={micro.attributes.Content}
														id={micro.id}
														open={open}
														openNotes={opennotePopup}
														openshare={opensharemodel}
													/>
												);
											})}
									{searchOptionType === 0 &&
										maxbeams
											.filter((item) => {
												const searchterm = searchTerm.toLowerCase();
												const title = item.attributes.Title.toLowerCase();

												return title.includes(searchterm);
											})
											.map((micro) => {
												return (
													<Maxbeamscard
														Title={micro.attributes.Title}
														Desc={micro.attributes.shortDesc}
														id={micro.id}
														open={open}
														openshare={opensharemodel}
													/>
												);
											})}
									{searchOptionType === 1 &&
										microbeams
											.filter((item) => {
												const searchterm = searchTerm.toLowerCase();
												const title = item.attributes.Title.toLowerCase();

												return title.includes(searchterm);
											})
											.map((micro) => {
												return (
													<Minibeamscard
														title={micro.attributes.Title}
														content={micro.attributes.Content}
														id={micro.id}
														open={open}
														openNotes={opennotePopup}
														openshare={opensharemodel}
													/>
												);
											})}
									{searchOptionType === 2 &&
										maxbeams
											.filter((item) => {
												const searchterm = searchTerm.toLowerCase();
												const title = item.attributes.Title.toLowerCase();

												return title.includes(searchterm);
											})
											.map((micro) => {
												return (
													<Maxbeamscard
														Title={micro.attributes.Title}
														Desc={micro.attributes.shortDesc}
														id={micro.id}
														open={open}
														openshare={opensharemodel}
													/>
												);
											})}
								</div>
							) : (
								<BeatLoader />
							)}
						</div>
					</div>
				)}
			</section>
		</div>
	);
};
