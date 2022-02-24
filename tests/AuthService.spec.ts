import { test } from '@japa/runner'
import { AuthService } from "../app/services/AuthService";

test.group('AuthService', () => {
  test('Token validation', ({ expect }) => {
    // Test logic goes here
    expect(AuthService.validate("Hello world")).toEqual(true);
  })
})
