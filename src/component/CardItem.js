import React from 'react';
import PropTypes from 'prop-types';
import pet from './../assets/pet.jpg';


const CardItem = ({ name, origin, image, data = null }) => {

    const [showDetail, setShowDetail] = React.useState(false);

    const renderTitleFromKey = (title) => {
        let newTitle = '';
        if(title && typeof(data) === 'string' && title.indexOf('_') !== -1) {
            
            newTitle = title.replace('_', " ").toUpperCase();
        } else {
            newTitle = title.toUpperCase();
        }

        return newTitle
    }

    const renderValue = (key, value) => {
        if(key === 'weight') {
            return `Imperial: ${value.imperial} , Metric: ${value.metric}`
        }

        return value
    }

    return (
        <div className="card-item"> 
            <div className="card-item-image-wrapper">
                <img className="card-item-image" src={image}></img>
            </div>
            <div className="card-item-content"> 
                <h3 className="card-item-title">{name}</h3>
                <p className="card-item-origin">{origin}</p>
                <div className="card-item-button-wrapper"> 
                    <button onClick={() => setShowDetail(!showDetail)} className="card-item-button">Detail</button>
                </div>
            </div>
            {showDetail && (
                <div className="card-item-detail">
                    <table>
                        <tbody>
                            {Object.keys(data).map((key, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{renderTitleFromKey(key)}</td>
                                        <td>{renderValue(key,data[key])}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

CardItem.propTypes = {
    data: PropTypes.object
}
CardItem.defaultProps = {
    data: null
}


export default CardItem;