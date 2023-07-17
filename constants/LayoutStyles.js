import Colors from "../constants/Colors";

/**
 * Stildefinitionen für das Layout der Komponenten.
 */
export default {
  /**
   * Stile für den oberen Container.
   */
  topContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  /**
   * Stile für den mittleren Container.
   */
  middleContainer: {
    flex: 4,
    padding: 30,
    justifyContent: "space-evenly",
  },

  /**
   * Stile für den unteren Container.
   */
  bottomContainer: {
    backgroundColor: Colors.accent,
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 30,
  },
};
