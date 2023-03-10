import React, { useState, useEffect } from "react";
import "./Maxbeamsong.css";
import songcardmock from "../../assets/maxbeamsong.png";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import AudioPlayer from "react-h5-audio-player";
import { BeatLoader } from "react-spinners";
import "react-h5-audio-player/lib/styles.css";
import { API } from "../../constants";

export const Maxbeamsong = () => {
	const { token } = useAuthContext();
	const [microbeams, setMicrobeams] = useState({});
	const [microbeamsload, setMicrobeamsload] = useState(false);
	const { id } = useParams();

	const fetchdata = async () => {
		setMicrobeamsload(true);
		const data = await fetch(`${API}/minibeams/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
			.then((res) => res.json())
			.then((e) => {
				// console.log(e.data.attributes);
				setMicrobeams(e.data.attributes);
				setMicrobeamsload(false);
			});
	};

	useEffect(() => {
		fetchdata();
	}, []);

	return (
		<div className="Maxbeamsong mttop">
			{microbeamsload ? (
				<BeatLoader />
			) : (
				<div className="songcard">
					<img src={songcardmock} alt="" className="scardbanner" />
					<span>{microbeams.Title}</span>
					<AudioPlayer src={microbeams.audiourl} style={{ color: "blue" }} />
				</div>
			)}
		</div>
	);
};
