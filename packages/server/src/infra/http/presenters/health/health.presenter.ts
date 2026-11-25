export class HealthPresenter {
  static toHTTP(date: Date = new Date()) {
    return {
      success: true,
      date,
    };
  }
}
