import { useParams } from "react-router-dom";
import "./GoalPage.scss";
import { SDGs } from "../../assets/goalsData";

function GoalPage() {
    const name = useParams();
    const goal = SDGs.find((item) => {
        return (Number(name.goalId) === item.id);
    });
    console.log(goal);
    return (
        <div>
            <h1>
                {goal.name}
            </h1>
            GoalPage {name.goalId}
        </div>
    )
}

export default GoalPage