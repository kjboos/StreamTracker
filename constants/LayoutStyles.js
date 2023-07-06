import Colors from "../constants/Colors";

export default {
  topContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  middleContainer: {
    flex: 4,
    padding: 30,
    justifyContent: "space-evenly",
  },

  bottomContainer: {
    backgroundColor: Colors.accent,
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 30,
  },
};
